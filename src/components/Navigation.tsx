import { Github, Linkedin, Instagram } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-transparent mix-blend-difference">
      <div className="flex gap-3 md:gap-6 text-[10px] md:text-sm font-sans tracking-widest uppercase">
        <a href="#projects" className="hover:text-accent transition-colors">Proyectos</a>
        <a href="#about" className="hover:text-accent transition-colors hidden sm:inline">About</a>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-tighter text-glow cursor-pointer whitespace-nowrap">
          CANISPETYA
        </h1>
      </div>

      <div className="flex gap-2 md:gap-4">
        <a href="https://github.com/canispetya" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Github className="w-4 h-4 md:w-5 md:h-5" /></a>
        <a href="https://www.linkedin.com/in/canispetya" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Linkedin className="w-4 h-4 md:w-5 md:h-5" /></a>
        <a href="https://www.instagram.com/canispetya/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
      </div>
    </nav>
  );
}
