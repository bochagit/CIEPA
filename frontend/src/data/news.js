// Mock data for news articles
export const newsData = [
  {
    id: 1,
    title: "Nueva sede de CIEPA en Buenos Aires",
    content: "CIEPA anuncia la apertura de su nueva sede en el centro de Buenos Aires, ampliando su presencia en la región metropolitana. Esta nueva oficina permitirá brindar mejor atención a los ciudadanos y organizaciones de la zona.",
    author: "Juan Pérez",
    publishDate: "2024-01-15",
    category: "Institucional",
    status: "published",
    featured: true,
    imageUrl: "https://via.placeholder.com/600x300?text=Sede+CIEPA",
    excerpt: "CIEPA anuncia la apertura de su nueva sede en el centro de Buenos Aires..."
  },
  {
    id: 2,
    title: "Nuevos cursos de capacitación técnica",
    content: "Se abren las inscripciones para los nuevos cursos de capacitación técnica en energías renovables y sustentabilidad. Los cursos comenzarán el próximo mes y tienen cupos limitados.",
    author: "María González",
    publishDate: "2024-01-20",
    category: "Educación",
    status: "published",
    featured: false,
    imageUrl: "https://via.placeholder.com/600x300?text=Capacitacion+Tecnica",
    excerpt: "Se abren las inscripciones para los nuevos cursos de capacitación técnica..."
  },
  {
    id: 3,
    title: "Convenio con universidades nacionales",
    content: "CIEPA firma convenios de cooperación con principales universidades del país para promover la investigación en políticas ambientales. Este acuerdo permitirá intercambio de conocimientos y recursos.",
    author: "Carlos Rodriguez",
    publishDate: "2024-01-25",
    category: "Convenios",
    status: "draft",
    featured: true,
    imageUrl: "https://via.placeholder.com/600x300?text=Convenio+Universidades",
    excerpt: "CIEPA firma convenios de cooperación con principales universidades..."
  },
  {
    id: 4,
    title: "Conferencia Internacional de Medio Ambiente",
    content: "CIEPA organizará la próxima conferencia internacional sobre políticas ambientales que se realizará en abril. Expertos de todo el mundo participarán en este importante evento.",
    author: "Ana López",
    publishDate: "2024-02-01",
    category: "Eventos",
    status: "published",
    featured: false,
    imageUrl: "https://via.placeholder.com/600x300?text=Conferencia+Ambiental",
    excerpt: "CIEPA organizará la próxima conferencia internacional sobre políticas ambientales..."
  },
  {
    id: 5,
    title: "Nuevas tecnologías para monitoreo ambiental",
    content: "Implementación de nuevas tecnologías de sensores IoT para el monitoreo en tiempo real de la calidad del aire y agua en zonas urbanas. Este proyecto piloto comenzará en marzo.",
    author: "Roberto Silva",
    publishDate: "2024-02-05",
    category: "Tecnología",
    status: "draft",
    featured: true,
    imageUrl: "https://via.placeholder.com/600x300?text=Tecnologia+Ambiental",
    excerpt: "Implementación de nuevas tecnologías de sensores IoT para el monitoreo..."
  }
];

export const categories = [
  "Institucional",
  "Educación", 
  "Convenios",
  "Investigación",
  "Eventos",
  "Tecnología",
  "Medio Ambiente",
  "Noticias"
];

export const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" }
];

// Helper functions for CRUD operations (mock)
export const createNews = (newsData) => {
  // Mock implementation - in real app would call API
  const newId = Math.max(...newsData.map(n => n.id)) + 1;
  return { ...newsData, id: newId, publishDate: new Date().toISOString().split('T')[0] };
};

export const updateNews = (id, updatedData) => {
  // Mock implementation - in real app would call API
  return { ...updatedData, id };
};

export const deleteNews = (id) => {
  // Mock implementation - in real app would call API
  return id;
};

export const getNewsById = (id) => {
  return newsData.find(news => news.id === parseInt(id));
};