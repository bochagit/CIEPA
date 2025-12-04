import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextEditor from './TextEditor';
import { format, parseISO } from 'date-fns';
import { uploadService } from '../services/uploadCloudinary';
import { Box, CircularProgress, IconButton, Typography, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { categoryService } from '../services/categoryService';
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'

const statusOptions = [
  { value: 'published', label: 'Publicado' },
  { value: 'draft', label: 'Borrador' },
  { value: 'archived', label: 'Archivado' }
]

const VisuallyHiddenInput = {
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
}

function NewsForm(props) {
  const { handleClose, handleSubmit, initialValue, open, title } = props;
  const [editorUploading, setEditorUploading] = React.useState(false)
  const [categories, setCategories] = React.useState([])
  const [uploadedCoverImage, setUploadedCoverImage] = React.useState(null)
  const [originalCoverImage, setOriginalCoverImage] = React.useState(null)
  const isEditing = Boolean(initialValue && initialValue._id)

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories()
        setCategories(categoriesData)
      } catch(error) {
        console.error("Error cargando categorías: ", error)
        setCategories([
          { _id: '1', name: 'General' },
          { _id: '2', name: 'Educación' },
          { _id: '3', name: 'Medio ambiente' }
        ])
      }
    }

    fetchCategories()
  }, [])

  const [formData, setFormData] = React.useState(
    initialValue ?? {
      title: '',
      content: '',
      authors: [{ name: '' }],
      date: new Date().toISOString().split('T')[0],
      category: '',
      status: 'draft',
      featured: false,
      coverImage: '',
      summary: ''
    }
  );

  const [imageFile, setImageFile] = React.useState(null)
  const [imagePreview, setImagePreview] = React.useState(null)
  const [uploading, setUploading] = React.useState(false)

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleEditorUploadChange = (isUploading) => {
    setEditorUploading(isUploading)
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')){
        alert('Por favor selecciona un archivo de imagen valido')
        return;
      }

      if (file.size > 5 * 1024 * 1024){
        alert('El archivo es demasiado grande. Máximo 5MB')
        return;
      }

      setImageFile(file)

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      console.log('Imagen seleccionada: ', file.name, file.size, 'bytes')
    }
  }

  const handleRemoveImage = async () => {
    const shouldDeleteFromCloudinary = (
      (!isEditing && uploadedCoverImage) || 
      (isEditing && uploadedCoverImage && uploadedCoverImage !== originalCoverImage) ||
      (isEditing && uploadedCoverImage && formData.coverImage === coverImage)
    )

    if (shouldDeleteFromCloudinary && formData.coverImage){
      try {
        await uploadService.deleteImageByUrl(formData.coverImage)
        console.log('Imagen de portada eliminada: ', formData.coverImage)
      } catch(error) {
        console.warn('No se pudo eliminar imagen de Cloudinary')
      }
    }
    setUploadedCoverImage(null)
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      coverImage: ''
    }))
  }

  const uploadImage = async (file) => {
    try {
      setUploading(true)
      console.log('Iniciando upload...')

      if (formData.coverImage && uploadedCoverImage && uploadedCoverImage !== originalCoverImage){
        try {
          await uploadService.deleteImageByUrl(formData.coverImage)
          console.log('Imagen anterior eliminada: ', formData.coverImage)
        } catch(error) {
          console.warn('No se pudo eliminar imagen anterior: ', error.message)
        }
      }

      const result = await uploadService.uploadPostImage(file)
      console.log('Upload exitoso: ', result)
      setUploadedCoverImage(result.url)
      return result.url
    } catch(error) {
      console.error('Error subiendo imagen: ', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors]
    newAuthors[index] = { name: value }
    setFormData(prev => ({ ...prev, authors: newAuthors }))
  }

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, { name: '' }]
    }))
  }

  const removeAuthor = (index) => {
    if (formData.authors.length > 1) {
      const newAuthors = formData.authors.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, authors: newAuthors }))
    }
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.content) {
      return
    }

    const validAuthors = formData.authors.filter(author => author.name.trim())

    if (validAuthors.length === 0) {
      alert('Debe incluir al menos un autor')
      return
    }

    try {
      let finalFormData = { ...formData, authors: validAuthors }

      if (imageFile) {
        console.log('Subiendo imagen a Cloudinary...')
        const imageUrl = await uploadImage(imageFile)
        finalFormData.coverImage = imageUrl
        console.log('Imagen subida a Cloudinary: ', imageUrl)
      }

      handleSubmit(finalFormData);
      setUploadedCoverImage(null)
      setOriginalCoverImage(null)
    } catch (error) {
      console.error('Error al procesar formulario: ', error)
      alert('Error al subir la imagen, intentelo nuevamente.')
    }
  };

  const handleFormClose = async() => {
    if (uploadedCoverImage){
      const isNewImage = !isEditing || (isEditing && uploadedCoverImage !== originalCoverImage)

      if (isNewImage){
        try {
          await uploadService.deleteImageByUrl(uploadedCoverImage)
          console.log('Imagen de portada eliminada al cancelar: ', uploadedCoverImage)
        } catch(error) {
          console.warn('Error eliminando imagen al cancelar: ', error.message)
        }
      }
    }

    setUploadedCoverImage(null)
    setOriginalCoverImage(null)
    setImageFile(null)
    setImagePreview(null)

    handleClose()
  }

  React.useEffect(() => {
    return () => {
      if (uploadedCoverImage && !formData._id){
        uploadService.deleteImageByUrl(uploadedCoverImage).catch(error => 
          console.warn('Error en cleanup de imagen: ', error.message)
        )
      }
    }
  }, [uploadedCoverImage, formData._id])

  React.useEffect(() => {
    if (initialValue) {
      console.log('Datos iniciales recibidos: ', initialValue)

      if (initialValue.coverImage){
        setOriginalCoverImage(initialValue.coverImage)
      }

      if (initialValue.content) {
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g
        const contentImages = []
        let match
        
        while((match = imgRegex.exec(initialValue.content)) !== null){
          if (match[1] && match[1].includes('cloudinary.com')){
            contentImages.push(match[1])
          }
        }
      }

      const formatDateSafely = (dateInput) => {
        if (!dateInput) return format(new Date(), 'yyyy-MM-dd')

        console.log('Procesando fecha original: ', dateInput)
        
        try {
          if (typeof dateInput === 'string'){
            if(/^\d{4}-\d{2}-\d{2}$/.test(dateInput)){
              console.log('Fecha ya en formato correcto: ', dateInput)
              return dateInput
            }
            
            if(dateInput.includes('T')){
              const dateOnly = dateInput.split('T')[0]
              console.log('Fecha extraída sin conversión: ', dateOnly)
              return dateOnly
            }

            console.log('Usando parseISO como último recurso')
            const parsed = parseISO(dateInput)
            return format(parsed, 'yyyy-MM-dd')
          }

            if (dateInput instanceof Date){
              console.log('Formateando objeto Date')
              return format(dateInput, 'yyyy-MM-dd')
            }
        } catch(error) {
          console.warn('Error parseando fecha: ', error)
          return format(new Date(), 'yyyy-MM-dd')
        }

        return format(new Date(), 'yyyy-MM-dd')
      }

      const adaptedData = {
        _id: initialValue._id,
        title: initialValue.title || '',
        content: initialValue.content || '',
        authors: initialValue.authors?.length > 0 ? initialValue.authors : [{ name: '' }],
        date: formatDateSafely(initialValue.date),
        category: initialValue.category || '',
        status: initialValue.status || 'draft',
        featured: initialValue.featured || false,
        coverImage: initialValue.coverImage || '',
        summary: initialValue.summary || ''
      }
      setFormData(adaptedData);

      if (initialValue.coverImage){
        setImagePreview(initialValue.coverImage)
        console.log('Imagen de portada configurada: ', initialValue.coverImage)
      }
    } else {
      setOriginalCoverImage(null)
      setUploadedCoverImage(null)
    }
  }, [initialValue, isEditing]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleFormClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={onFormSubmit}
          spacing={2}
          sx={{ pt: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="title">Título</FormLabel>
            <OutlinedInput
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Título de la noticia"
              required
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="summary">Resumen/Extracto</FormLabel>
            <TextField
              id="summary"
              name="summary"
              multiline
              minRows={3}
              maxRows={10}
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Breve resumen de la noticia..."
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  alignItems: 'flex-start',
                  height: 'auto',
                  minHeight: 'auto'
                },
                '& .MuiInputBase-input': {
                  height: 'auto !important',
                  overflow: 'auto !important',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                },
                '& textarea': {
                  lineHeight: 1.5
                }
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="content">Contenido</FormLabel>
            <TextEditor id="content" value={formData.content} onChange={handleContentChange} onUploadChange={handleEditorUploadChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Autores</FormLabel>
            <Stack spacing={1}>
              {formData.authors.map((author, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  p: 1.5,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                  alignItems: 'center'
                }}>
                  <PersonIcon sx={{ color: 'text.secondary' }} />
                  <OutlinedInput
                    size="small"
                    fullWidth
                    placeholder={`Autor ${index + 1}`}
                    value={author.name}
                    onChange={(e) => handleAuthorChange(index, e.target.value)}
                  />
                  <IconButton
                    onClick={() => removeAuthor(index)}
                    disabled={formData.authors.length === 1}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addAuthor}
                variant="outlined"
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              >
                Agregar Autor
              </Button>
            </Stack>
          </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel htmlFor="date">Fecha de publicación</FormLabel>
              <TextField
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel htmlFor="category">Categoría</FormLabel>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {categories.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: .5 }}>
                  No hay categorías disponibles. Crea una en la sección de categorías.
                </Typography>
              )}
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel htmlFor="status">Estado</FormLabel>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <FormControl>
            <FormLabel sx={{ mb: 1 }}>Imagen de portada</FormLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  disabled={uploading}
                  sx={{ minWidth: 160 }}
                >
                  {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={VisuallyHiddenInput}
                    />
                </Button>

                {(imagePreview || formData.coverImage) && (
                  <IconButton
                    color="error"
                    onClick={handleRemoveImage}
                    size="small"
                    disabled={uploading}
                    >
                      <DeleteIcon />
                    </IconButton>
                )}
              </Stack>

              {imagePreview && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Avatar
                    src={imagePreview}
                    sx={{ width: 80, height: 80 }}
                    variant="rounded"
                  >
                    <ImageIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {imageFile ? imageFile.name : 'Imagen actual'}
                    </Typography>
                    {imageFile && (
                      <Typography variant="caption" color="text.secondary">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    )}
                    {uploading && (
                      <Typography variant="caption" color="primary" sx={{ mx: 2 }}>
                        Subiendo a Cloudinary...
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary">
                Formatos soportados: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
              </Typography>
            </Box>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
            }
            label="Noticia destacada"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormClose} disabled={uploading} sx={{ '&:hover': { border: '1px solid #f00', backgroundColor: 'transparent' } }}>Cancelar</Button>
        <Button type="submit" onClick={onFormSubmit} variant="contained" disabled={!formData.title || !formData.content || uploading || editorUploading}>
          {(uploading || editorUploading) ? 'Procesando...' : (initialValue ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewsForm;