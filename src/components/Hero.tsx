import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section id="about" className="h-[100dvh] w-screen flex flex-col justify-center items-center relative overflow-hidden bg-background">
      {/* Background with grain */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#110000] opacity-80" />
      </div>

      <div className="z-10 text-center flex flex-col items-center">
        <h2 className="text-xl md:text-3xl font-serif italic text-accent opacity-90 mb-4 tracking-wider">
          Bienvenido a mi portafolio
        </h2>

        {/* Distorted Main Title - Slightly smaller and more margin */}
        <h1 className="text-[7vw] sm:text-[8vw] md:text-6xl lg:text-7xl w-full max-w-[100vw] font-display font-black text-foreground uppercase mb-4 sm:mb-8 leading-none text-glow mix-blend-screen mix-blend-difference filter drop-shadow-[0_0_30px_rgba(227,66,52,0.8)] px-2 sm:px-4 whitespace-nowrap text-center">
          DISEÑO Y <br /> DESARROLLO
        </h1>

        <p className="w-full max-w-[90vw] md:max-w-xl text-xs sm:text-sm md:text-lg text-gray-300 font-sans mt-4 md:mt-8 px-2 md:px-4 opacity-80 leading-relaxed text-center box-border">
          Creo aplicaciones web de alto rendimiento que abrazan el caos de los sistemas escalables modernos.
          <br /><br />
          Desarrollador full-stack especializado en React, Node y Supabase.
        </p>

      </div>

      {/* Improved Scroll Indicator */}
      <a 
        href="#first-project" 
        onClick={(e) => {
          e.preventDefault();
          const firstProject = document.getElementById('first-project');
          if (firstProject) {
            firstProject.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
          }
        }}
        className="absolute bottom-12 right-8 md:right-16 z-30 group"
      >
        <motion.div 
          className="flex items-center gap-4 text-xs font-sans tracking-[0.2em] uppercase text-accent group-hover:text-accent transition-all duration-300 cursor-pointer group-hover:scale-110"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="hidden sm:inline opacity-70 group-hover:opacity-100 transition-opacity">Desliza para explorar</span>
          <motion.div 
            animate={{ x: [0, 8, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="flex items-center justify-center p-3 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md shadow-[0_0_25px_rgba(227,66,52,0.6)] group-hover:shadow-[0_0_35px_rgba(227,66,52,0.8)] transition-shadow"
          >
            <ArrowRight size={24} className="text-accent filter drop-shadow-[0_0_8px_rgba(227,66,52,0.8)]" />
          </motion.div>
        </motion.div>
      </a>
    </section>
  );
}
