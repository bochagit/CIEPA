import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Post from '../models/Post.js'
import connectDB from '../config/db.js'

dotenv.config()

const APPLY = process.argv.includes('--apply')
let exitCode = 0
const LIMIT = Number((process.argv.find(a => a.startsWith('--limit=')) || '').split('=')[1]) || 0

const NBSP_SOURCE = '&nbsp;|&#160;|&#xa0;|\\u00a0'
const NBSP_RE = new RegExp(NBSP_SOURCE, 'gi')
const NBSP_QUERY = { $regex: NBSP_SOURCE, $options: 'i' }

const countNbsp = (value) =>
    (typeof value === 'string' ? (value.match(new RegExp(NBSP_SOURCE, 'gi')) || []).length : 0)

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
    try {
        await connectDB()

        const filter = { $or: [{ content: NBSP_QUERY }, { summary: NBSP_QUERY }] }
        const posts = await Post.find(filter).select('_id title date summary content').sort({ date: -1 })

        if (posts.length === 0) {
            console.log('No hay notas con nbsp. Nada que hacer.')
            return
        }

        console.log(`\nModo: ${APPLY ? 'APLICAR (escribe en la base)' : 'DRY-RUN (no escribe nada)'}`)
        console.log(`Notas afectadas: ${posts.length}\n`)

        const selected = LIMIT > 0 ? posts.slice(0, LIMIT) : posts

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

            if (changedContent) console.log(buildPreview(before.content, after.content))
            if (changedSummary) console.log(`      summary: ${JSON.stringify(before.summary)}  =>  ${JSON.stringify(after.summary)}`)

            if (APPLY) {
                const sets = {}
                if (changedContent) sets.content = after.content
                if (changedSummary) sets.summary = after.summary
                await Post.updateOne({ _id: post._id }, { $set: sets })
                console.log('      GUARDADO')
            }
        }

        if (!APPLY) {
            console.log(`\nDry-run terminado. No se modifico nada.`)
            console.log(`Para aplicar: node src/scripts/fixNbspContent.js --apply`)
        } else {
            console.log(`\nListo. ${selected.length} nota(s) corregida(s).`)
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