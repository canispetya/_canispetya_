import { Send } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="relative h-[100dvh] w-screen bg-[#020202] flex flex-col justify-center items-center p-6 md:p-12 z-10 overflow-y-auto">
      <div className="w-full max-w-lg md:max-w-2xl flex flex-col gap-6 md:gap-10 box-border">
        {/* Title in normal document flow, not absolute */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-serif italic text-white opacity-80 border-b border-accent pb-2 md:pb-4 inline-block">
            Contáctame
          </h2>
        </div>

        <form 
          className="flex flex-col gap-6 w-full" 
          action="https://formsubmit.co/nicko.pereira@gmail.com" 
          method="POST"
        >
          {/* FormSubmit Configuration */}
          <input type="hidden" name="_subject" value="Nuevo contacto desde tu Portafolio Web!" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="box" />
          <input type="hidden" name="_next" value={window.location.href} />

          <div className="relative group">
            <input
              required
              name="name"
              type="text"
              id="name"
              placeholder=" "
              className="peer w-full bg-transparent border-b border-[#333] py-2 md:py-3 text-white font-sans text-base md:text-lg focus:outline-none focus:border-accent transition-colors"
            />
            <label
              htmlFor="name"
              className="absolute left-0 top-2 md:top-3 text-gray-500 font-sans tracking-widest uppercase text-xs md:text-sm -translate-y-6 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 transition-all"
            >
              Nombre
            </label>
          </div>

          <div className="relative group">
            <input
              required
              name="email"
              type="email"
              id="email"
              placeholder=" "
              className="peer w-full bg-transparent border-b border-[#333] py-2 md:py-3 text-white font-sans text-base md:text-lg focus:outline-none focus:border-accent transition-colors"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-2 md:top-3 text-gray-500 font-sans tracking-widest uppercase text-xs md:text-sm -translate-y-6 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 transition-all"
            >
              Correo
            </label>
          </div>

          <div className="relative group">
            <textarea
              required
              name="message"
              id="message"
              rows={3}
              placeholder=" "
              className="peer w-full bg-transparent border-b border-[#333] py-2 md:py-3 text-white font-sans text-base md:text-lg focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <label
              htmlFor="message"
              className="absolute left-0 top-2 md:top-3 text-gray-500 font-sans tracking-widest uppercase text-xs md:text-sm -translate-y-6 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 transition-all"
            >
              Mensaje
            </label>
          </div>

          <button
            type="submit"
            className="group relative self-center md:self-start mt-2 md:mt-4 flex items-center justify-center gap-2 md:gap-4 bg-transparent border border-white px-4 md:px-8 py-3 md:py-4 text-white font-sans uppercase tracking-widest md:tracking-[0.2em] text-xs sm:text-sm md:text-base hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto shrink-0"
          >
            Enviar Mensaje
            <Send size={16} className="group-hover:translate-x-2 transition-transform shrink-0" />
          </button>
        </form>
      </div>
    </section>
  );
}
