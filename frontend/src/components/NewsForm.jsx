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
import { categories, statusOptions } from '../data/news';
import TextEditor from './textEditor';

function NewsForm(props) {
  const { handleClose, handleSubmit, initialValue, open, title } = props;

  const [formData, setFormData] = React.useState(
    initialValue ?? {
      title: '',
      content: '',
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      category: '',
      status: 'draft',
      featured: false,
      imageUrl: '',
      excerpt: ''
    }
  );

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(formData);
  };

  React.useEffect(() => {
    if (initialValue) {
      setFormData(initialValue);
    }
  }, [initialValue]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
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

          <FormControl>
            <FormLabel htmlFor="excerpt">Resumen/Extracto</FormLabel>
            <TextField
              id="excerpt"
              name="excerpt"
              multiline
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Breve resumen de la noticia..."
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="content">Contenido</FormLabel>
            <TextEditor id="content" value={formData.content} onChange={handleContentChange} />
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel htmlFor="author">Autor</FormLabel>
              <OutlinedInput
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nombre del autor"
                required
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel htmlFor="publishDate">Fecha de publicación</FormLabel>
              <TextField
                id="publishDate"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </FormControl>
          </Stack>

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
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
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
            <FormLabel htmlFor="imageUrl">URL de imagen</FormLabel>
            <OutlinedInput
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
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
        <Button onClick={handleClose} sx={{ '&:hover': { border: '1px solid #f00', backgroundColor: 'transparent' } }}>Cancelar</Button>
        <Button type="submit" onClick={onFormSubmit} variant="contained">
          {initialValue ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewsForm;