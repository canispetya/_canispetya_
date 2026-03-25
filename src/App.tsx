import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { ProjectGallery } from './components/ProjectGallery';
import { Contact } from './components/Contact';
import { Bio } from './components/Bio';
import { SkillsStack } from './components/SkillsStack';
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
      // Skip if a modal is open (modals have z-[100])
      if (document.querySelector('.z-\\[100\\]')) return;
      
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
      // Allow default vertical scroll if the target is an input or is inside a scrollable container
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      
      // Check if we're inside a scrollable element (like Bio text)
      let target = e.target as HTMLElement;
      while (target && target !== container) {
        const style = window.getComputedStyle(target);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          const isScrollable = target.scrollHeight > target.clientHeight;
          if (isScrollable) {
            // If scrolling up at top or down at bottom, allow snap to next section
            const isAtTop = target.scrollTop <= 0 && e.deltaY < 0;
            const isAtBottom = Math.ceil(target.scrollTop + target.clientHeight) >= target.scrollHeight && e.deltaY > 0;
            if (!isAtTop && !isAtBottom) {
              return; // Allow internal vertical scroll
            }
          }
        }
        target = target.parentElement as HTMLElement;
      }
      
      const modal = document.querySelector('.z-\\[100\\]');
      if (modal) {
        const scrollable = modal.querySelector('.overflow-y-auto');
        if (scrollable) {
          scrollable.scrollBy({ top: e.deltaY, behavior: 'auto' });
          return;
        }
      }

      e.preventDefault();
      handleScroll(e.deltaY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      
      // Similar logic for arrow keys in scrollable containers
      let target = document.activeElement as HTMLElement;
      if (target && target.tagName !== 'BODY') {
        while (target && target !== container) {
          const style = window.getComputedStyle(target);
          if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
             if (e.key === 'ArrowUp' || e.key === 'ArrowDown') return; // Let the element handle arrow keys
          }
          target = target.parentElement as HTMLElement;
        }
      }
      const modal = document.querySelector('.z-\\[100\\]');
      if (modal) {
        const scrollable = modal.querySelector('.overflow-y-auto') as HTMLElement;
        if (scrollable) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            scrollable.scrollBy({ top: 100, behavior: 'smooth' });
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollable.scrollBy({ top: -100, behavior: 'smooth' });
          }
          return;
        }
      }
      
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
        className="flex h-[100dvh] w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth outline-none focus:outline-none scrollbar-hide"
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

        <div id="section-skills" className="flex-none w-screen h-[100dvh] snap-always snap-center shrink-0">
          <SkillsStack />
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
