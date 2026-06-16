import { Github, Linkedin, Instagram } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 py-5 flex justify-between items-center bg-transparent mix-blend-difference">
      <div className="flex gap-4 md:gap-8 text-[11px] md:text-sm font-sans tracking-[0.2em] uppercase">
        <a 
          href="#section-gallery" 
          onClick={(e) => {
            e.preventDefault();
            const gallery = document.getElementById('section-gallery');
            gallery?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hover:text-accent transition-colors"
        >
          Proyectos
        </a>
        <a 
          href="#section-services" 
          onClick={(e) => {
            e.preventDefault();
            const services = document.getElementById('section-services');
            services?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hover:text-accent transition-colors"
        >
          Servicios
        </a>
        <a 
          href="#section-bio" 
          onClick={(e) => {
            e.preventDefault();
            const bio = document.getElementById('section-bio');
            bio?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hover:text-accent transition-colors hidden sm:inline"
        >
          Bio
        </a>
        <a 
          href="#section-skills" 
          onClick={(e) => {
            e.preventDefault();
            const skills = document.getElementById('section-skills');
            skills?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hover:text-accent transition-colors hidden sm:inline"
        >
          Stack
        </a>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <a 
          href="#section-hero"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('main-scroll-container')?.scrollTo({ left: 0, behavior: 'smooth' });
          }}
          className="block group"
        >
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tighter text-glow cursor-pointer whitespace-nowrap active:scale-95 transition-transform">
            CANISPETYA
          </h1>
        </a>
      </div>

      <div className="flex gap-3 md:gap-5">
        <a href="https://github.com/canispetya" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Github className="w-4 h-4 md:w-5 md:h-5" /></a>
        <a href="https://www.linkedin.com/in/canispetya" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Linkedin className="w-4 h-4 md:w-5 md:h-5" /></a>
        <a href="https://www.instagram.com/canispetya/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
      </div>
    </nav>
  );
}
