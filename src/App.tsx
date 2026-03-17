import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { ProjectGallery } from './components/ProjectGallery';
import { Contact } from './components/Contact';
import { Bio } from './components/Bio';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { Analytics } from '@vercel/analytics/react';

function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Autofocus container on mount for immediate keyboard support
    container.focus();

    const handleScroll = (delta: number) => {
      if (isScrolling.current) return;
      
      const direction = delta > 0 ? 1 : -1;
      isScrolling.current = true;

      // Scroll exactly one viewport width at a time
      container.scrollBy({ left: direction * window.innerWidth, behavior: 'smooth' });

      // Faster debounce (400ms) for better responsiveness
      setTimeout(() => {
        isScrolling.current = false;
      }, 400);
    };

    // Convert vertical native wheel scrolling to snap horizontally
    const handleWheel = (e: WheelEvent) => {
      // Allow default vertical scroll if the target is a textarea (like in contact form)
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    // Keyboard support for immediate interaction
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleScroll(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleScroll(-1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="grainy-bg text-foreground selection:bg-accent selection:text-white h-[100dvh] w-screen overflow-hidden">
      <Navigation />

      {/* 
        Main Horizontal Scroll Container 
        Width is fixed to viewport, but content overflows horizontally.
      */}
      <div
        ref={containerRef}
        id="main-scroll-container"
        tabIndex={0}
        className="flex h-[100dvh] w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth outline-none focus:outline-none"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} // Hide native scrollbar for cleanliness
      >
        <div id="section-hero" className="flex-none w-screen h-[100dvh] snap-always snap-center shrink-0">
          <Hero />
        </div>

        {/* Gallery is no longer w-screen, it expands based on content */}
        <div id="section-gallery" className="flex-none h-[100dvh] snap-always snap-start shrink-0">
          <ProjectGallery />
        </div>

        <div id="section-bio" className="flex-none w-screen h-[100dvh] snap-always snap-center shrink-0">
          <Bio />
        </div>

        <div id="section-contact" className="flex-none w-screen h-[100dvh] snap-always snap-center shrink-0">
          <Contact />
        </div>

        <div className="flex-none w-[100vw] md:w-[320px] h-[100dvh] bg-[#020202] relative flex flex-col snap-always snap-center shrink-0 border-l border-accent/30">
          {/* Vertical Red Line Separator */}
          <div className="absolute left-0 top-0 w-[2px] h-full bg-accent shadow-[0_0_15px_rgba(227,66,52,0.5)] z-20" />

          {/* Local Video Loop Precisely Centered */}
          <div className="flex-1 flex items-center justify-center p-8">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border border-accent/20 shadow-[0_0_50px_rgba(227,66,52,0.15)] transition-all duration-700"
            >
              <source src="/assets/video/canis360.mp4" type="video/mp4" />
            </video>
          </div>

          <footer className="w-full text-center pb-12 px-8 relative z-10 border-t border-[#222] pt-8 bg-black/40 backdrop-blur-sm">
            <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase opacity-50 leading-relaxed">
              © {new Date().getFullYear()} CANISPETYA.<br />
              <span className="opacity-30">TODOS LOS DERECHOS RESERVADOS.</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
