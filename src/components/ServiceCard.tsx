import { ArrowUpRight } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  created_at: string;
  short_description: string;
  long_description: string;
  image_url: string;
  icon: string;
  tags: string[];
  link_url?: string;
  size: string;
  image_position: string;
  image_fit?: 'cover' | 'contain';
  order_index: number;
}

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const dimensions = {
    small: 'w-[80vw] md:w-[260px] h-[40vh] md:h-[300px]',
    medium: 'w-[85vw] md:w-[400px] h-[50vh] md:h-[480px]',
    large: 'w-[90vw] md:w-[700px] h-[45vh] md:h-[400px]',
  }[service.size] || 'w-[85vw] md:w-[420px] h-[50vh] md:h-[400px]';

  return (
    <div 
      className="group relative flex flex-col gap-4 cursor-pointer indicator-container w-fit h-fit mb-8 md:mb-12"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden border border-[#222] bg-black ${dimensions}`}>
        <img 
          src={service.image_url} 
          alt={service.title}
          className={`w-full h-full ${service.image_fit === 'contain' ? 'object-contain' : 'object-cover'} opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0 ${service.image_position || 'object-center'}`}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Service icon badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-base">{service.icon}</span>
          <span className="text-[9px] font-sans uppercase tracking-widest text-accent font-bold">Servicio</span>
        </div>

        {/* Hover View Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-20 h-20 rounded-full border border-white/30 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 group-hover:border-white transition-all duration-500 transform scale-90 group-hover:scale-100 bg-black/20 backdrop-blur-sm">
           <ArrowUpRight className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-col gap-1 z-10 px-2">
        <h3 className="text-lg md:text-2xl font-serif text-white mb-1 leading-tight line-clamp-2 group-hover:text-accent transition-all duration-300">
          {service.title}
        </h3>
        {service.short_description && (
          <p className="text-[10px] md:text-xs font-sans text-gray-400 leading-relaxed line-clamp-2 max-w-[300px]">
            {service.short_description}
          </p>
        )}
        <div className="flex gap-2 flex-wrap mt-1">
           {service.tags?.map(tag => (
             <span key={tag} className="text-[9px] md:text-[10px] font-sans border border-[#333] px-2 py-1 uppercase tracking-wider text-gray-400">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
}
