import * as React from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, TablePagination, Tooltip, Stack, CircularProgress, Alert } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import EmailIcon from '@mui/icons-material/Email'
import { contactService } from '../services/contactService'
import useNotifications from '../hooks/useNotifications/useNotifications'
import PageContainer from './PageContainer'
import { brand } from '../../shared-theme/themePrimitives'
import { useContacts } from '../context/ContactsContext'

export default function ContactsList() {
    const [contacts, setContacts] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [total, setTotal] = React.useState(0)
    const [selectedContact, setSelectedContact] = React.useState(null)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [notas, setNotas] = React.useState('')
    const [error, setError] = React.useState('')
    const notifications = useNotifications()
    const { refreshUnreadCount } = useContacts()

    React.useEffect(() => {
        fetchContacts()
    }, [page, rowsPerPage])

    const fetchContacts = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await contactService.getAllContacts({
                page: page + 1,
                limit: rowsPerPage
            })
            setContacts(response.contacts || [])
            setTotal(response.pagination?.total || 0)
        } catch (error) {
            console.error('Error al cargar contactos:', error)
            setError('Error al cargar los mensajes de contacto')
            notifications.show('Error al cargar contactos', { severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleViewContact = async (contact) => {
        setSelectedContact(contact)
        setNotas(contact.notas || '')
        setOpenDialog(true)

        if (!contact.leido) {
            try {
                await contactService.updateContact(contact._id, { leido: true })
                fetchContacts()
                refreshUnreadCount()
            } catch (error) {
                console.error('Error al marcar como leído:', error)
            }
        }
    }

    const handleMarkAsResponded = async () => {
        try {
            await contactService.updateContact(selectedContact._id, {
                respondido: true,
                notas
            })
            notifications.show('Contacto marcado como respondido', { severity: 'success' })
            setOpenDialog(false)
            fetchContacts()
            refreshUnreadCount()
        } catch (error) {
            console.error('Error al actualizar contacto:', error)
            notifications.show('Error al actualizar contacto', { severity: 'error' })
        }
    }

    const handleToggleRead = async (e, contact) => {
        e.stopPropagation()
        try {
            await contactService.updateContact(contact._id, { leido: !contact.leido })
            notifications.show(contact.leido ? 'Marcado como no leído' : 'Marcado como leído', { severity: 'success' })
            fetchContacts()
            refreshUnreadCount()
        } catch (error) {
            console.error('Error al actualizar estado:', error)
            notifications.show('Error al actualizar estado', { severity: 'error' })
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return

        try {
            await contactService.deleteContact(id)
            notifications.show('Mensaje eliminado', { severity: 'success' })
            fetchContacts()
            refreshUnreadCount()
        } catch (error) {
            console.error('Error al eliminar contacto:', error)
            notifications.show('Error al eliminar mensaje', { severity: 'error' })
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    if (loading && contacts.length === 0) {
        return (
            <PageContainer title="Mensajes de Contacto">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        )
    }

    return (
        <PageContainer title="Mensajes de Contacto">
            <Stack spacing={3}>
                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Correo</TableCell>
                                <TableCell>Mensaje</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No hay mensajes de contacto
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts.map((contact) => (
                                    <TableRow 
                                        key={contact._id}
                                        onClick={() => handleViewContact(contact)}
                                        sx={{ 
                                            backgroundColor: !contact.leido ? 'action.hover' : 'inherit',
                                            '&:hover': { 
                                                backgroundColor: 'action.selected',
                                                cursor: 'pointer'
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" noWrap>
                                                {formatDate(contact.createdAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: !contact.leido ? 600 : 400 }}>
                                                {contact.nombre}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2" noWrap>
                                                    {contact.correo}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                                {contact.mensaje.substring(0, 80)}
                                                {contact.mensaje.length > 80 && '...'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="column" spacing={0.5}>
                                                <Chip
                                                    label={contact.leido ? 'Leído' : 'No leído'}
                                                    color={contact.leido ? 'default' : 'primary'}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                                {contact.respondido && (
                                                    <Chip 
                                                        label="Respondido" 
                                                        color="success" 
                                                        size="small"
                                                        icon={<CheckIcon />}
                                                    />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center" sx={{ display: 'flex', gap: .5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Tooltip title={contact.leido ? 'Marcar como no leído' : 'Marcar como leído'}>
                                                <IconButton 
                                                    onClick={(e) => handleToggleRead(e, contact)} 
                                                    size="small"
                                                    color={contact.leido ? 'default' : 'primary'}
                                                >
                                                    <EmailIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton 
                                                    onClick={(e) => handleDelete(e, contact._id)} 
                                                    size="small" 
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                </TableContainer>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ backgroundColor: brand.main, color: 'white' }}>
                        Detalle del Mensaje
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {selectedContact && (
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Fecha
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedContact.createdAt)}
                                    </Typography>
                                </Box>
                                
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Nombre
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {selectedContact.nombre}
                                    </Typography>
                                </Box>
                                
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Correo electrónico
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EmailIcon fontSize="small" />
                                        <Typography variant="body1">
                                            {selectedContact.correo}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Box>
                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                        Mensaje
                                    </Typography>
                                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {selectedContact.mensaje}
                                        </Typography>
                                    </Paper>
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    maxRows={10}
                                    label="Notas internas"
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Agregá notas sobre este contacto..."
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            alignItems: 'flex-start',
                                            height: 'auto',
                                            minHeight: 'auto',
                                            padding: '12px',
                                        },
                                        '& .MuiInputBase-input': {
                                            height: 'auto !important',
                                            overflow: 'auto !important',
                                            whiteSpace: 'pre-wrap',
                                            wordWrap: 'break-word'
                                        },
                                        '& textarea': {
                                            resize: 'none',
                                            lineHeight: 1.5
                                        }
                                    }}
                                />
                            </Stack>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button onClick={() => setOpenDialog(false)} variant="outlined">
                            Cerrar
                        </Button>
                        {selectedContact && !selectedContact.respondido && (
                            <Button 
                                onClick={handleMarkAsResponded} 
                                variant="contained" 
                                startIcon={<CheckIcon />}
                                color="success"
                            >
                                Marcar como Respondido
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Stack>
        </PageContainer>
    )
}
