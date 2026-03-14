import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.get('name')) newErrors.name = 'El nombre es obligatorio';
    if (!formData.get('email')) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email') as string)) {
      newErrors.email = 'Formato de correo inválido';
    }
    if (!formData.get('message')) newErrors.message = 'El mensaje no puede estar vacío';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/nicko.pereira@gmail.com", {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        setStatus('success');
        // Reset form
        (e.target as HTMLFormElement).reset();
        // Hide success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative h-[100dvh] w-screen bg-[#020202] flex flex-col justify-center items-center p-6 md:p-12 z-10 overflow-y-auto">
      {/* Cinematic Success Overlay */}
      {status === 'success' && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-[fadeIn_0.5s_ease-out] backdrop-blur-xl"
          onAnimationEnd={(e) => {
            if (e.animationName === 'fadeOut') setStatus('idle');
          }}
        >
          <div className="text-center animate-[scaleIn_0.6s_ease-out] px-6">
            <CheckCircle size={80} className="text-accent mx-auto mb-8 animate-pulse" />
            <h3 className="text-4xl md:text-7xl font-serif italic text-white mb-4 tracking-tighter">
              ¡Mensaje Enviado!
            </h3>
            <p className="text-accent font-sans text-xs md:text-sm tracking-[0.4em] uppercase opacity-70">
              Gracias por contactarme. Responderé pronto.
            </p>
          </div>
          {/* Progress bar for auto-closing */}
          <div className="absolute bottom-0 left-0 h-1 bg-accent animate-[progressBar_4.5s_linear_forwards]" 
               onAnimationEnd={() => {
                 const overlay = document.querySelector('.fixed.inset-0.bg-black');
                 overlay?.classList.add('animate-[fadeOut_0.8s_ease-in_forwards]');
                 setTimeout(() => setStatus('idle'), 800);
               }}
          />
        </div>
      )}

      {status === 'error' && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-6 py-4 flex items-center gap-4 animate-[fadeIn_0.5s_ease-out] border border-red-500/40 z-[200] rounded-sm backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-red-200">Error al enviar</span>
            <span className="text-[10px] opacity-80 uppercase tracking-tighter">Por favor intenta de nuevo más tarde.</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg md:max-w-2xl flex flex-col gap-6 md:gap-10 box-border">
        {/* Title in normal document flow, not absolute */}
        <div className="text-center mt-12 md:mt-20">
          <h2 className="text-2xl md:text-4xl font-serif italic text-white opacity-80 border-b border-accent pb-2 md:pb-4 inline-block uppercase tracking-wider">
            Contáctame
          </h2>
        </div>

        <form 
          className="flex flex-col gap-6 w-full" 
          onSubmit={handleSubmit}
          noValidate
        >
          {/* FormSubmit Configuration (using AJAX endpoint) */}
          <input type="hidden" name="_subject" value="Nuevo contacto desde tu Portafolio Web!" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="name" value="User Form Submission" /> {/* Fallback name for FormSubmit if needed */}

          <div className="relative group">
            <input
              name="name"
              type="text"
              placeholder="Nombre Completo"
              className={`w-full bg-transparent border-b ${errors.name ? 'border-accent' : 'border-white/20'} py-4 text-white font-serif italic text-base md:text-lg focus:border-accent outline-none transition-colors placeholder:text-gray-600 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:font-sans`}
            />
            {errors.name && <span className="absolute -bottom-5 left-0 text-[10px] text-accent font-sans font-bold uppercase tracking-tighter animate-[fadeIn_0.3s_ease-out]">{errors.name}</span>}
          </div>

          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="Tu Correo Electrónico"
              className={`w-full bg-transparent border-b ${errors.email ? 'border-accent' : 'border-white/20'} py-4 text-white font-serif italic text-base md:text-lg focus:border-accent outline-none transition-colors placeholder:text-gray-600 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:font-sans`}
            />
            {errors.email && <span className="absolute -bottom-5 left-0 text-[10px] text-accent font-sans font-bold uppercase tracking-tighter animate-[fadeIn_0.3s_ease-out]">{errors.email}</span>}
          </div>

          <div className="relative group">
            <textarea
              name="message"
              rows={4}
              placeholder="Tu Mensaje"
              className={`w-full bg-transparent border-b ${errors.message ? 'border-accent' : 'border-white/20'} py-4 text-white font-serif italic text-base md:text-lg focus:border-accent outline-none transition-colors resize-none placeholder:text-gray-600 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:font-sans`}
            />
            {errors.message && <span className="absolute -bottom-5 left-0 text-[10px] text-accent font-sans font-bold uppercase tracking-tighter animate-[fadeIn_0.3s_ease-out]">{errors.message}</span>}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="group relative self-center md:self-start mt-2 md:mt-4 flex items-center justify-center gap-2 md:gap-4 bg-transparent border border-white px-4 md:px-8 py-3 md:py-4 text-white font-display font-bold uppercase tracking-widest md:tracking-[0.2em] text-xs sm:text-sm md:text-base hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto shrink-0 disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
            <Send size={16} className={`group-hover:translate-x-2 transition-transform shrink-0 ${status === 'loading' ? 'animate-pulse' : ''}`} />
          </button>
        </form>
      </div>
    </section>
  );
}
