import { Send } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="relative min-h-screen w-screen bg-[#020202] flex flex-col justify-center items-center py-24 z-10">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-serif italic text-white opacity-80 border-b border-accent pb-4 inline-block">
          Connect
        </h2>
      </div>

      <div className="w-full max-w-2xl px-6 mt-16">
        <form className="flex flex-col gap-8 w-full" onSubmit={(e) => e.preventDefault()}>
          <div className="relative group">
            <input 
              type="text" 
              id="name" 
              placeholder=" "
              className="peer w-full bg-transparent border-b border-[#333] py-4 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors"
            />
            <label 
              htmlFor="name" 
              className="absolute left-0 top-4 text-gray-500 font-sans tracking-widest uppercase text-sm -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 transition-all"
            >
              Name
            </label>
          </div>

          <div className="relative group">
            <input 
              type="email" 
              id="email" 
              placeholder=" "
              className="peer w-full bg-transparent border-b border-[#333] py-4 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors"
            />
            <label 
              htmlFor="email" 
              className="absolute left-0 top-4 text-gray-500 font-sans tracking-widest uppercase text-sm -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 transition-all"
            >
              Email
            </label>
          </div>

          <div className="relative group">
            <textarea 
              id="message" 
              rows={4}
              placeholder=" "
              className="peer w-full bg-transparent border-b border-[#333] py-4 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <label 
              htmlFor="message" 
              className="absolute left-0 top-4 text-gray-500 font-sans tracking-widest uppercase text-sm -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 transition-all"
            >
              Message
            </label>
          </div>

          <button 
            type="submit" 
            className="group relative self-start mt-8 flex items-center gap-4 bg-transparent border border-white px-8 py-4 text-white font-sans uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
          >
            Send Message
            <Send size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </div>
    </section>
  );
}
