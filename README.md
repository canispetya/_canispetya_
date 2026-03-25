# CANISPETYA - Portafolio Personal Premium

Este proyecto es el portafolio personal de **CANISPETYA**, desarrollado con una estética cinematográfica, moderna y de alto rendimiento. El sitio combina un diseño visual impactante con una arquitectura técnica robusta.

---

## 🛠️ Tecnologías y Herramientas

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utilitarios personalizados para efectos de brillo y glassmorphism).
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) (Transiciones suaves, gestos y efectos de entrada).
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL para gestión de proyectos, biografía y stack técnico).
- **Despliegue:** [Vercel](https://vercel.com/) (Optimizado para CI/CD con GitHub).

---

## ✨ Características Principales

### 🖥️ Interfaz de Usuario (UI/UX)
- **Hero Section Cinemático:** Logo vectorial integrado con sombras protectoras, tipografía fluida con `clamp()` para adaptabilidad perfecta y video de fondo texturizado.
- **Galería de Proyectos Horizontal:** Sistema de scroll horizontal suave con soporte para gestos, rueda de mouse y teclado (`ArrowRight` / `ArrowLeft`).
- **Modales de Proyecto Inteligentes:** Ventanas emergentes con scroll interno independiente, proxy de eventos de scroll y cierre con tecla `Escape`.
- **Biografía Responsiva:** Layout con foto de perfil, texto bio con scroll interno aislado, secciones de estudios y badges. Tipografía proporcional con breakpoints `lg`/`xl` para escalado suave entre resoluciones desktop.
- **Stack & Herramientas:** Sección dedicada con pills `rounded-full` interactivos, organizados en 4 categorías con emojis. Grid de 2 columnas en desktop, columna única en móvil, con scroll interno aislado.
- **Elementos Decorativos:** Sistema que permite intercalar GIFs o imágenes no interactivas en la galería para pausas visuales rítmicas.
- **Footer Interactivo:** Video `canis360.mp4` con máscara circular y efecto de color al pasar el mouse.

### ⚙️ Gestión de Contenido (Admin)
- **Panel Administrativo:** Interfaz protegida con 3 pestañas: Proyectos, Biografía y Stack & Skills.
- **Base de Datos Dinámica:** Integración con Supabase para actualizaciones en tiempo real sin necesidad de redeplegar el sitio.
- **CRUD de Skills:** Agregar/editar/eliminar categorías y habilidades individuales desde el panel admin con pills interactivos.
- **Personalización Total:** Control de `order_index`, ajustes de imagen (`contain` / `cover`), etiquetas dinámicas e íconos de categoría.

### ⌨️ Accesibilidad y Navegación
- **Navegación por Teclado:** Soporte total para flechas direccionales y Escape en modales.
- **Scroll Isolation:** Componentes con contenido desbordado (Bio, Stack) permiten scroll vertical interno sin disparar el snap horizontal.
- **Responsive Design:** Adaptación total desde iPhone SE hasta monitores UltraWide. Layout horizontal sin scroll vertical en desktop (`100dvh`), scroll vertical natural en móvil.

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

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── Hero.tsx              # Sección principal con video de fondo
│   ├── ProjectGallery.tsx    # Galería horizontal de proyectos
│   ├── ProjectCard.tsx       # Tarjeta individual de proyecto
│   ├── ProjectModal.tsx      # Modal detalle de proyecto
│   ├── Bio.tsx               # Biografía con foto, estudios y badges
│   ├── SkillsStack.tsx       # Stack & Herramientas con pills
│   ├── Contact.tsx           # Formulario de contacto
│   ├── Navigation.tsx        # Barra de navegación fija
│   ├── AdminDashboard.tsx    # Panel de administración (3 tabs)
│   └── Login.tsx             # Autenticación admin
├── lib/
│   └── supabase.ts           # Cliente Supabase
├── App.tsx                   # Layout principal + scroll horizontal
└── index.css                 # Estilos globales + utilidades
```

---

## 🗄️ Base de Datos (Supabase)

| Tabla | Descripción |
|-------|-------------|
| `projects` | Proyectos y decoraciones de la galería |
| `bio` | Biografía, foto, estudios y badges |
| `skill_categories` | Categorías de habilidades con pills |

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
