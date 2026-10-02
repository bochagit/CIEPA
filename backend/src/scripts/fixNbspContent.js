import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Post from '../models/Post.js'
import connectDB from '../config/db.js'

dotenv.config()

const APPLY = process.argv.includes('--apply')
let exitCode = 0
const LIMIT = Number((process.argv.find(a => a.startsWith('--limit=')) || '').split('=')[1]) || 0
const ONLY_ID = (process.argv.find(a => a.startsWith('--id=')) || '').split('=')[1] || ''

const NBSP_RE = /&nbsp;|&#160;|&#xa0;|\u00a0/gi
const NBSP_QUERY = { $regex: '&nbsp;|&#160;|&#xa0;|\\x{00a0}', $options: 'i' }

const countNbsp = (value) =>
    (typeof value === 'string' ? (value.match(NBSP_RE) || []).length : 0)

const countSpaces = (value) =>
    (typeof value === 'string' ? (value.match(/ /g) || []).length : 0)

// % de espacios que son no separables. Una nota generada por Quill 2 da ~100%
// (su getSemanticHTML convierte el 100% de los espacios); una nota vieja con
// nbsp pegado de Word/web da un porcentaje bajo.
const densityOf = (value) => {
    const nb = countNbsp(value)
    const total = nb + countSpaces(value)
    return total ? (nb / total) * 100 : 0
}

const normalize = (value) =>
    typeof value === 'string' ? value.replace(NBSP_RE, ' ') : value

const buildPreview = (before, after) => {
    let i = 0
    while (i < before.length && before[i] === after[i]) i++
    const start = Math.max(0, i - 30)
    const cut = (s) => JSON.stringify(s.slice(start, i + 50))
    return `      antes: ${cut(before)}\n      despues: ${cut(after)}`
}

const fixNbspContent = async () => {
    if (ONLY_ID && !/^[a-f\d]{24}$/i.test(ONLY_ID)) {
        console.error(`--id invalido: "${ONLY_ID}". Debe ser un ObjectId de 24 hex.`)
        process.exit(1)
    }

    try {
        await connectDB()

        const filter = ONLY_ID
            ? { _id: ONLY_ID }
            : { $or: [{ content: NBSP_QUERY }, { summary: NBSP_QUERY }] }

        const posts = await Post.find(filter).select('_id title date summary content').sort({ date: -1 })

        if (posts.length === 0) {
            console.log(ONLY_ID
                ? `No se encontro la nota ${ONLY_ID}.`
                : 'No hay notas con nbsp. Nada que hacer.')
            return
        }

        console.log(`\nModo: ${APPLY ? 'APLICAR (escribe en la base)' : 'DRY-RUN (no escribe nada)'}`)
        console.log(ONLY_ID ? `Filtro: solo la nota ${ONLY_ID}` : 'Filtro: todas las notas con nbsp')
        console.log(`Notas afectadas: ${posts.length}\n`)

        const selected = LIMIT > 0 ? posts.slice(0, LIMIT) : posts
        let saved = 0

        for (const post of selected) {
            const before = {
                content: typeof post.content === 'string' ? post.content : '',
                summary: typeof post.summary === 'string' ? post.summary : ''
            }
            const after = {
                content: normalize(before.content),
                summary: normalize(before.summary)
            }

            const changedContent = before.content !== after.content
            const changedSummary = before.summary !== after.summary

            console.log(`  - [${post._id}] ${post.title} (${post.date ? new Date(post.date).toISOString().slice(0, 10) : 'sin fecha'})`)
            console.log(`      nbsp en content: ${countNbsp(before.content)} | en summary: ${countNbsp(before.summary)}`)
            console.log(`      densidad nbsp: ${densityOf(before.content).toFixed(1)}% (${countNbsp(before.content)} de ${countNbsp(before.content) + countSpaces(before.content)} espacios)${densityOf(before.content) >= 95 ? '  <-- patologica, generada por Quill 2' : ''}`)

            if (changedContent) console.log(buildPreview(before.content, after.content))
            if (changedSummary) console.log(`      summary: ${JSON.stringify(before.summary)}  =>  ${JSON.stringify(after.summary)}`)

            if (!changedContent && !changedSummary) {
                console.log('      sin nbsp: no se toca')
                continue
            }

            if (APPLY) {
                const sets = {}
                if (changedContent) sets.content = after.content
                if (changedSummary) sets.summary = after.summary
                await Post.updateOne({ _id: post._id }, { $set: sets })
                console.log('      GUARDADO')
                saved++
            }
        }

        if (!APPLY) {
            console.log(`\nDry-run terminado. No se modifico nada.`)
            console.log(`Para aplicar: ${ONLY_ID
                ? `node src/scripts/fixNbspContent.js --id=${ONLY_ID} --apply`
                : 'node src/scripts/fixNbspContent.js --apply'}`)
        } else {
            console.log(`\nListo. ${saved} nota(s) corregida(s).`)
        }

        if (LIMIT > 0 && posts.length > LIMIT) {
            console.log(`\nAVISO: habia ${posts.length} notas afectadas y solo se procesaron ${LIMIT} (--limit).`)
        }
    } catch (error) {
        console.error('Error corrigiendo nbsp: ', error.message)
        exitCode = 1
    } finally {
        mongoose.disconnect()
        process.exit(exitCode)
    }
}

fixNbspContent()