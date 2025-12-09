# 🌱 CIEPA — Sitio Web Institucional + API

Proyecto completo del sitio institucional del **Centro Interdisciplinario de Estudios en Políticas Ambientales (CIEPA)**, incluyendo:

- **Frontend**: Blog institucional y páginas informativas.
- **Backend (API)**: Gestión de publicaciones, almacenamiento de recursos y panel administrativo.
- **Infraestructura**: Deploy en hosting con ISPConfig (nginx) + API en servidor Node.

Sitio en producción: https://ciepa.agro.uba.ar

---

## 🎯 Objetivo del proyecto

El propósito del proyecto fue desarrollar una plataforma web moderna para que CIEPA pueda:

✔ Publicar noticias, informes y material institucional  
✔ Comunicar actividades académicas, eventos y publicaciones  
✔ Gestionar contenido desde un panel propio  
✔ Integrar recursos multimedia como imágenes y documentos  

El proyecto fue desarrollado en su totalidad por mí, desde el diseño del sistema hasta la implementación full-stack y el deploy productivo.

---

## 🛠️ Tecnologías usadas

### Frontend
- **React**
- **Vite**
- **React Router**
- **Axios**
- **Editor WYSIWYG con saneamiento HTML**
- **Renderización SPA bajo nginx**

### Backend
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **Bcrypt**
- **Cloudinary (CDN de imágenes)**

### Infraestructura
- **ISPConfig + nginx**
- **API sobre Node en servidor dedicado**
- **Let’s Encrypt SSL**
- **FTP para deploy**

---

## 🗂️ Estructura del proyecto

/project  
│  
├── frontend/ # Sitio React (Vite)  
│ ├── src/  
│ │ ├── assets/  
│ │ ├── components/  
│ │ ├── context/  
│ │ ├── hooks/  
│ │ ├── services/  
│ │ ├── theme/  
│ │ └── App.jsx  
│ ├── public/  
│ ├── shared-theme/  
│ ├── .env.example  
│ ├── index.html  
│ ├── package.json  
│ └── vite.config.js  
│  
└── backend/ # API Node  
├── src/  
│ ├── config/  
│ ├── controllers/  
│ ├── middlewares/  
│ ├── models/  
│ ├── routes/  
│ ├── app.js  
│ └── server.js  
├── .env.example  
├── package.json  
└── README.md  

---

## 🚧 Features desarrollados

### Frontend
- Diseño institucional adaptado a identidad visual de CIEPA
- Blog dinámico con vista de artículos
- Página institucional (Misión, objetivos, líneas de investigación)
- Formateo seguro de contenido HTML
- Soporte para imágenes en portada y cuerpo
- Presentación multilínea de contenidos
- UI administrable y extensible

### Backend
- Endpoints CRUD protegidos para gestión de notas
- Autenticación JWT
- Hashing de contraseñas
- Uso de Cloudinary para portadas y contenido embebido
- Sanitización de HTML contra XSS
- Modelo de datos extensible para informes o publicaciones académicas

---

## 🔐 Seguridad y sanitización HTML

Se realizó un tratamiento especial para permitir HTML en los posts, manteniendo seguridad:

- **DOMPurify / sanitize-html**
- Strict mode con whitelists
- Remoción de scripts, iframes y payloads XSS
- Permisión limitada de tags de estilo y formato
- Upload de imágenes mediante Cloudinary (sin almacenarlas en el servidor)

---

SSL

Dominio configurado con Let’s Encrypt

Redirección a https automática

Cloudflare opcional como capa de seguridad

📄 Licencia

Proyecto desarrollado para CIEPA — Universidad de Buenos Aires.
Uso institucional. No redistribuir sin permiso.

👤 Autor

Proyecto desarrollado por Gonzalo Cardozo
Desarrollo full-stack — Arquitectura — Deploy en producción
Contacto: https://www.linkedin.com/in/gonzalo-cardozo-4490992a3/ / gocardozo@alumno.unlam.edu.ar
