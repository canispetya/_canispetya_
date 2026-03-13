import { useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { ProjectGallery } from './components/ProjectGallery';
import { Contact } from './components/Contact';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Convert vertical native wheel scrolling to horizontal scrolling for the entire app
    const handleWheel = (e: WheelEvent) => {
      // Allow default vertical scroll if the target is a textarea (like in contact form)
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="grainy-bg text-foreground selection:bg-accent selection:text-white h-screen w-screen overflow-hidden">
      <Navigation />
      
      {/* 
        Main Horizontal Scroll Container 
        Width is fixed to viewport, but content overflows horizontally.
      */}
      <div 
        ref={containerRef}
        className="flex h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none' }} // Hide native scrollbar for cleanliness
      >
        <div className="flex-none w-screen h-screen snap-center">
          <Hero />
        </div>
        
        {/* Gallery is no longer w-screen, it expands based on content */}
        <div className="flex-none h-screen snap-center">
          <ProjectGallery />
        </div>

        <div className="flex-none w-screen h-screen snap-center">
          <Contact />
        </div>
        
        <div className="flex-none w-[300px] h-screen bg-[#020202] flex flex-col justify-end pb-12 pr-12 snap-center">
          <footer className="w-full text-right text-xs font-sans tracking-widest uppercase opacity-50 border-t border-[#222] pt-4">
            <p>© {new Date().getFullYear()} PORTFOLIO.<br/>ALL RIGHTS RESERVED.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
