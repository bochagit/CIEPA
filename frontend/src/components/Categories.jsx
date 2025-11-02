import * as React from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material'
import { categoryService } from '../services/categoryService'

export default function CategoryManager(){
    const [categories, setCategories] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [editingCategory, setEditingCategory] = React.useState(null)
    const [formData, setFormData] = React.useState({ name: '' })
    const [submitting, setSubmitting] = React.useState(false)
    const [successMessage, setSuccessMessage] = React.useState()

    const fetchCategories = React.useCallback(async () => {
        try {
            setLoading(true)
            const data = await categoryService.getAllCategories()
            setCategories(data)
            setError('')
        } catch(error) {
            setError(error.message)
            console.error("Error al cargar las categorías", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleCreate = () => {
        setEditingCategory(null)
        setFormData({ name: '' })
        setSuccessMessage('')
        setDialogOpen(true)
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setFormData({ name: category.name })
        setSuccessMessage('')
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setEditingCategory(null)
        setFormData({ name: '' })
        setSuccessMessage('')
    }

    const handleInputChange = (event) => {
        setFormData({ name: event.target.value })
    }

    const handleSubmit = async () => {
        const trimmedName = formData.name.trim()

        if(!trimmedName){
            setError("El nombre es obligatorio")
            return
        }

        try {
            setSubmitting(true)
            setError('')

            if (editingCategory){
                await categoryService.updateCategory(editingCategory._id, { name: trimmedName })
                setSuccessMessage("Categoría actualizada exitosamente")
            } else {
                await categoryService.createCategory({ name: trimmedName })
                setSuccessMessage("Categoría creada exitosamente")
            }

            handleCloseDialog()
            fetchCategories()

            setTimeout(() => setSuccessMessage(''), 3000)
        } catch(error) {
            setError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (category) => {
        if (!window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)){
            return
        }

        try {
            await categoryService.deleteCategory(category._id)
            setSuccessMessage("Categoría eliminada exitosamente")
            fetchCategories()

            setTimeout(() => setSuccessMessage(''), 3000)
        } catch(error) {
            setError(error.message)
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !submitting){
            handleSubmit()
        }
    }

    if (loading){
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ m: 5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Gestión de categorías
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    Nueva categoría
                </Button>
            </Stack>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>
                                    <Typography variant="body1" fontWeight="medium">
                                        {category.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton
                                            onClick={() => handleEdit(category)}
                                            color="primary"
                                            size="small"
                                            title="Editar"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(category)}
                                            color="error"
                                            size="small"
                                            title="Eliminar"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    <Typography color="text.secondary" sx={{ py: 4 }}>
                                        No hay categorías creadas
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Nombre de la categoría"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Ej.: Tecnología, Salud, Educación..."
                        sx={{ mt: 2 }}
                        disabled={submitting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting || !formData.name.trim()}
                    >
                        {submitting && <CircularProgress size={20} sx={{ mr: 1 }} />}
                        {editingCategory ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}