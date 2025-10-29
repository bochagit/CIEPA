import { Box, useColorScheme } from '@mui/material'
import React, { useState, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { secondary } from '../../shared-theme/themePrimitives'
import { uploadService } from '../services/uploadCloudinary'

export default function TextEditor({ value = '', onChange, onUploadChange, placeholder = "Escribe aquí..." }) {
    const [content, setContent] = useState(value)
    const { mode } = useColorScheme()
    const quillRef = useRef(null)

    const handleImageUpload = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')

        input.onchange = async () => {
            const file = input.files[0]
            if (!file) return
            
            if (!file.type.startsWith('image/')){
                alert('Por favor selecciona un archivo de imagen válido')
                return
            }

            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen es demasiado grande. Máximo 2MB para imágenes del editor.')
                return
            }

            try {
                console.log('Subiendo imagen del editor...', file.name)

                if (onUploadChange){
                    onUploadChange(true)
                }

                const quill = quillRef.current?.getEditor()
                if (!quill) return

                const range = quill.getSelection(true)
                quill.insertText(range.index, 'Subiendo imagen...', 'user')

                const result = await uploadService.uploadEditorImage(file)

                quill.deleteText(range.index, 'Subiendo imagen...'.length)

                quill.insertEmbed(range.index, 'image', result.url, 'user')

                quill.setSelection(range.index + 1)

                console.log('Imagen del editor subida: ', result.url)
            } catch(error) {
                console.error('Error subiendo imagen del editor: ', error)

                const quill = quillRef.current?.getEditor()
                if (quill) {
                    const range = quill.getSelection(true)
                    quill.deleteText(range.index, 'Subiendo imagen...'.length) 
                }

                alert('Error al subir la imagen: ' + error.message)
            } finally {
                if (onUploadChange){
                    onUploadChange(false)
                }
            }
        }

        input.click()
    }

    const modules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: handleImageUpload
            }
        },
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        }
    }), [])

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'color', 'background',
        'align', 'script'
    ]

    const handleChange = React.useCallback((newContent) => {
        setContent(newContent);
        if (onChange) {
            onChange(newContent);
        }
    }, [onChange]);

    React.useEffect(() => {
        setContent(value)
    }, [value])

    React.useEffect(() => {
        const quill = quillRef.current?.getEditor()
        if (quill) {
            const toolbar = quill.getModule('toolbar')
            if (toolbar){
                toolbar.addHandler('image', handleImageUpload)
            }
        }
    }, [])

    return (
        <Box sx={{
            '& .ql-editor': {
                minHeight: '40vh',
                fontFamily: 'inherit',
                backgroundColor: mode === 'dark' ? '#000' : '#fff',
            },
            '& .ql-toolbar': {
                backgroundColor: secondary.variant
            }
        }}>
            <ReactQuill 
                ref={quillRef}
                theme='snow' 
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </Box>
    )
}