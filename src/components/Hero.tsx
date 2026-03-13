export function Hero() {
  return (
    <section id="about" className="h-screen w-screen flex flex-col justify-center items-center relative overflow-hidden bg-background">
      {/* Background with grain */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#110000] opacity-80" />
      </div>

      <div className="z-10 text-center flex flex-col items-center">
        <h2 className="text-xl md:text-3xl font-serif italic text-accent opacity-90 mb-4 tracking-wider">
          A YEAR OF
        </h2>
        
        {/* Distorted Main Title */}
        <h1 className="text-6xl md:text-9xl font-display font-extrabold text-foreground tracking-tighter uppercase mb-6 leading-none text-glow mix-blend-screen mix-blend-difference filter drop-shadow-[0_0_30px_rgba(227,66,52,0.8)]">
          CODE <br /> MAYHEM
        </h1>

        <p className="max-w-xl text-lg text-gray-300 font-sans mt-8 px-4 opacity-80">
          I build high-performance web applications that embrace the chaos of modern scalable systems. Full-stack developer specializing in React, Node, and Supabase.
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-12 flex items-center gap-4 text-xs font-sans tracking-[0.2em] uppercase opacity-70">
          <span>Scroll</span>
          <div className="w-24 h-[1px] bg-accent relative overflow-hidden">
             <div className="absolute top-0 left-0 h-full bg-white w-1/3 animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
