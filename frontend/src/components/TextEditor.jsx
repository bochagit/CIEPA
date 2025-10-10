import { Box, useColorScheme } from '@mui/material'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { secondary } from '../../shared-theme/themePrimitives'

export default function TextEditor({ value = '', onChange, placeholder = "Escribe aquí..." }) {
    const [content, setContent] = useState(value)
    const { mode } = useColorScheme()

    const modules = {
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
            ]
        },
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        }
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'color', 'background',
        'align', 'script'
    ]

    const handleChange = (newContent) => {
        setContent(newContent);
        if (onChange) {
            onChange(newContent);
        }
    };

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