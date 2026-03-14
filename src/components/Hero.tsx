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

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-12 flex items-center gap-4 text-xs font-sans tracking-[0.2em] uppercase opacity-70">
          <span>Desplázate</span>
          <div className="w-24 h-[1px] bg-accent relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-white w-1/3 animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
