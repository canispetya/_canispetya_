import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section id="about" className="h-[100dvh] w-screen flex flex-col items-center relative overflow-hidden bg-background">
      {/* Background with grain */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#110000] opacity-80" />
      </div>

      {/* Main content — vertically centered with safe zones top & bottom */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 pt-24 pb-28 md:pt-20 md:pb-44">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 md:mb-8"
        >
          <img
            src="/assets/logo.svg"
            alt="Canispetya Logo"
            className="w-20 md:w-28 lg:w-32 h-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] contrast-[1.1]"
          />
        </motion.div>

        {/* Subtitle */}
        <h2 className="text-sm md:text-lg lg:text-xl font-serif italic text-accent opacity-90 mb-4 md:mb-6 tracking-widest">
          Bienvenido a mi portafolio
        </h2>

        {/* Main Title — refined, elegant proportions */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-foreground uppercase leading-[0.9] text-glow mix-blend-difference filter drop-shadow-[0_0_30px_rgba(227,66,52,0.8)] mb-8 md:mb-12 text-center px-2">
          DISEÑO Y <br /> DESARROLLO
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-gray-300 font-sans opacity-75 leading-relaxed text-center max-w-sm md:max-w-lg px-4">
          Creo aplicaciones web de alto rendimiento que abrazan el caos de los sistemas escalables modernos.
          <br /><br />
          Desarrollador full-stack especializado en React, Node y Supabase.
        </p>
      </div>

      {/* Scroll Indicator — pinned bottom-right */}
      <a
        href="#first-project"
        onClick={(e) => {
          e.preventDefault();
          const firstProject = document.getElementById('first-project');
          if (firstProject) {
            firstProject.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
          }
        }}
        className="absolute bottom-8 right-6 md:bottom-12 md:right-16 z-30 group"
      >
        <motion.div
          className="flex items-center gap-3 text-xs font-sans tracking-[0.2em] uppercase text-accent group-hover:text-accent transition-all duration-300 cursor-pointer group-hover:scale-110"
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
            <ArrowRight size={20} className="text-accent filter drop-shadow-[0_0_8px_rgba(227,66,52,0.8)]" />
          </motion.div>
        </motion.div>
      </a>
    </section>
  );
}
