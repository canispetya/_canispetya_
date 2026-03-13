import { Github, Linkedin, Twitter } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-transparent mix-blend-difference">
      <div className="flex gap-6 text-sm font-sans tracking-widest uppercase">
        <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
        <a href="#about" className="hover:text-accent transition-colors">About</a>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-3xl font-display font-bold tracking-tighter text-glow cursor-pointer">
          PORTFOLIO
        </h1>
      </div>

      <div className="flex gap-4">
        <a href="#" className="hover:text-accent transition-colors"><Github size={20} /></a>
        <a href="#" className="hover:text-accent transition-colors"><Linkedin size={20} /></a>
        <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
      </div>
    </nav>
  );
}
