import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { ProjectGallery } from './components/ProjectGallery';
import { Contact } from './components/Contact';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { Analytics } from '@vercel/analytics/react';

function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Convert vertical native wheel scrolling to snap horizontally
    const handleWheel = (e: WheelEvent) => {
      // Allow default vertical scroll if the target is a textarea (like in contact form)
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      e.preventDefault();

      if (isScrolling.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      isScrolling.current = true;

      // Scroll exactly one viewport width at a time
      container.scrollBy({ left: direction * window.innerWidth, behavior: 'smooth' });

      // Debounce to prevent rapid continuous scrolling
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
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
        className="flex h-[100dvh] w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} // Hide native scrollbar for cleanliness
      >
        <div id="section-hero" className="flex-none w-screen h-[100dvh] snap-always snap-center shrink-0">
          <Hero />
        </div>

        {/* Gallery is no longer w-screen, it expands based on content */}
        <div id="section-gallery" className="flex-none h-[100dvh] snap-always snap-start shrink-0">
          <ProjectGallery />
        </div>

        <div id="section-contact" className="flex-none w-screen h-[100dvh] snap-always snap-center shrink-0">
          <Contact />
        </div>

        <div className="flex-none w-[100vw] md:w-[300px] h-[100dvh] bg-[#020202] flex flex-col justify-end pb-12 pr-12 snap-always snap-center shrink-0">
          <footer className="w-full text-right text-xs font-sans tracking-widest uppercase opacity-50 border-t border-[#222] pt-4 px-8 md:px-0">
            <p>© {new Date().getFullYear()} CANISPETYA.<br />TODOS LOS DERECHOS RESERVADOS.</p>
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
