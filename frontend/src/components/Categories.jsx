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
    CircularProgress,
    Tabs,
    Tab,
    Chip
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Restore as RestoreIcon
} from '@mui/icons-material'
import { categoryService } from '../services/categoryService'

export default function CategoryManager(){
    const [categories, setCategories] = React.useState([])
    const [inactiveCategories, setInactiveCategories] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [editingCategory, setEditingCategory] = React.useState(null)
    const [formData, setFormData] = React.useState({ name: '' })
    const [submitting, setSubmitting] = React.useState(false)
    const [successMessage, setSuccessMessage] = React.useState()
    const [currentTab, setCurrentTab] = React.useState(0)

    const fetchCategories = React.useCallback(async () => {
        try {
            setLoading(true)
            const [activeData, inactiveData] = await Promise.all([
                categoryService.getAllCategories(),
                categoryService.getInactiveCategories()
            ])
            setCategories(activeData)
            setInactiveCategories(inactiveData)
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
        setError('')
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
            } else {
                await categoryService.createCategory({ name: trimmedName })
            }

            setDialogOpen(false)
            setEditingCategory(null)
            setFormData({ name: '' })

            await fetchCategories()

            const message = editingCategory ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente'
            setSuccessMessage(message)

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

    const handleReactivate = async (category) => {
        if (!window.confirm(`¿Estás seguro de reactivar la categoría "${category.name}"?`)){
            return
        }

        try {
            await categoryService.reactivateCategory(category._id)
            setSuccessMessage("Categoría reactivada exitosamente")
            fetchCategories()

            setTimeout(() => setSuccessMessage('', 3000))
        } catch(error) {
            setError(error.message)
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !submitting){
            handleSubmit()
        }
    }

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue)
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

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Activas
                                <Chip size="small" label={categories.length} color="primary" />
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Eliminadas
                                <Chip size="small" label={inactiveCategories.length} color="error" />
                            </Box>
                        }
                    />
                </Tabs>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(currentTab === 0 ? categories : inactiveCategories).map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>
                                    <Typography variant="body1" fontWeight="medium">
                                        {category.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={category.active ? "Activa" : "Eliminada"}
                                        color={category.active ? "success" : "error"}
                                        variant={category.active ? "filled" : "outlined"}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        {category.active ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <IconButton
                                                onClick={() => handleReactivate(category)}
                                                color="success"
                                                size="small"
                                                title="Reactivar"
                                            >
                                                <RestoreIcon />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(currentTab === 0 ? categories : inactiveCategories).length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    <Typography color="text.secondary" sx={{ py: 4 }}>
                                        {currentTab === 0 ? "No hay categorías activas" : "No hay categorías eliminadas"}
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