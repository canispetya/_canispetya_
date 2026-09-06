import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Service } from './ServiceCard';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        onClick={handleContentClick}
        className="relative w-full max-w-5xl max-h-[90dvh] bg-[#0a0a0a] border border-[#222] flex flex-col md:flex-row overflow-hidden rounded-sm animate-[fadeIn_0.3s_ease-out]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 bg-[#0a0a0a]/80 text-accent border border-accent rounded-full p-2 hover:bg-accent hover:text-white transition-all backdrop-blur-md"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-[35dvh] md:h-[80dvh] relative shrink-0">
          <img 
            src={service.image_url} 
            alt={service.title}
            className={`w-full h-full object-cover transition-all duration-700 ${service.image_position || 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-100" />
          
        </div>

        {/* Content Section */}
        <div id="modal-scroll-content" className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto">
          <p className="text-accent font-sans text-xs tracking-widest uppercase mb-2 md:mb-4">
            {service.created_at ? new Date(service.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) : 'Servicio'}
          </p>
          <h2 className="text-2xl md:text-5xl font-serif text-white mb-4 md:mb-6 leading-tight">
            {service.title}
          </h2>
          
          <div className="flex gap-2 flex-wrap mb-6 md:mb-8">
           {service.tags?.map(tag => (
             <span key={tag} className="text-[9px] md:text-[10px] font-sans border border-[#333] px-2 py-1 uppercase tracking-wider text-gray-400">
               {tag}
             </span>
           ))}
          </div>

          <div 
            className="font-sans text-gray-300 text-sm md:text-base leading-relaxed mb-6 md:mb-8 opacity-90 quill-content"
            dangerouslySetInnerHTML={{ __html: service.long_description || "Detalles del servicio..." }}
          />

          {service.link_url && (
            <a 
              href={service.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit border border-accent text-accent px-6 py-3 text-xs font-sans tracking-[0.2em] uppercase hover:bg-accent hover:text-white transition-all duration-300 mt-auto"
            >
              Ver Más
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
