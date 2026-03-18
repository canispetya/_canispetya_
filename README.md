# CANISPETYA - Portafolio Personal Premium

Este proyecto es el portafolio personal de **CANISPETYA**, desarrollado con una estética cinematográfica, moderna y de alto rendimiento. El sitio combina un diseño visual impactante con una arquitectura técnica robusta.

---

## 🛠️ Tecnologías y Herramientas

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utilitarios personalizados para efectos de brillo y glassmorphism).
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) (Transiciones suaves, gestos y efectos de entrada).
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL para gestión de proyectos y biografía).
- **Despliegue:** [Vercel](https://vercel.com/) (Optimizado para CI/CD con GitHub).

---

## ✨ Características Principales

### 🖥️ Interfaz de Usuario (UI/UX)
- **Hero Section Cinemático:** Logo vectorial integrado con sombras protectoras, tipografía fluida con `clamp()` para adaptabilidad perfecta y video de fondo texturizado.
- **Galería de Proyectos Horizontal:** Sistema de scroll horizontal suave con soporte para gestos, rueda de mouse y teclado (`ArrowRight` / `ArrowLeft`).
- **Modales de Proyecto Inteligentes:** Ventanas emergentes con scroll interno independiente, proxy de eventos de scroll y cierre con tecla `Escape`.
- **Elementos Decorativos:** Sistema que permite intercalar GIFs o imágenes no interactivas en la galería para pausas visuales rítmicas.
- **Footer Interactivo:** Video `canis360.mp4` con máscara circular y efecto de color al pasar el mouse.

### ⚙️ Gestión de Contenido (Admin)
- **Panel Administrativo:** Interfaz protegida para gestionar Proyectos, Decoraciones y datos de la Biografía.
- **Base de Datos Dinámica:** Integración con Supabase para actualizaciones en tiempo real sin necesidad de redeplegar el sitio.
- **Personalización Total:** Control de `order_index`, ajustes de ajuste de imagen (`contain` / `cover`) y etiquetas dinámicas.

### ⌨️ Accesibilidad y Navegación
- **Navegación por Teclado:** Soporte total para flechas direccionales y Escape en modales.
- **Responsive Design:** Adaptación total desde iPhone 12 Pro hasta monitores UltraWide mediante técnicas de `clamp()` y `flexbox`.

---

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Fondo (Background):** `#040404` (Estética Deep Black para pantallas OLED).
- **Texto (Foreground):** `#f1f1f1` (Blanco suave para reducir la fatiga visual).
- **Acento (Accent):** `#E34234` (Rojo neón para elementos de interacción).

### Tipografía
- **Display (Títulos):** `Syne` (800) - Usada para un impacto visual brutal.
- **Serif (Acentos):** `Playfair Display` (Italic) - Aporta elegancia y contraste clásico.
- **Sans (Interfaz):** `Inter` - Claridad y legibilidad técnica.

---

## 🚀 Instalación y Desarrollo

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/canispetya.git
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crea un archivo `.env` con tus credenciales de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url
    VITE_SUPABASE_ANON_KEY=tu_anon_key
    ```
4.  **Iniciar modo desarrollo:**
    ```bash
    npm run dev
    ```

---

*Desarrollado con ❤️ por CANISPETYA & Antigravity Assistant.*
