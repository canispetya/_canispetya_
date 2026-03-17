import { Play } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  created_at: string;
  image_url: string;
  tags: string[];
  size: string; // 'small', 'medium', 'large'
  image_position?: string;
  image_fit?: 'cover' | 'contain';
  order_index?: number;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  // Determine dimensions based on size mimicking the asymmetric layout
  // Uses responsive classes so it shrinks securely on mobile
  const dimensions = {
    small: 'w-[80vw] md:w-[280px] h-[45vh] md:h-[350px]',
    medium: 'w-[85vw] md:w-[420px] h-[55vh] md:h-[520px]',
    large: 'w-[90vw] md:w-[750px] h-[50vh] md:h-[450px]',
  }[project.size] || 'w-[85vw] md:w-[450px] h-[55vh] md:h-[450px]';

  return (
    <div 
      className="group relative flex flex-col gap-4 cursor-pointer indicator-container w-fit h-fit mb-8 md:mb-12"
      onClick={onClick}
    >
      {/* Image Container with fixed dimensions */}
      <div className={`relative overflow-hidden border border-[#222] bg-black ${dimensions}`}>
        <img 
          src={project.image_url} 
          alt={project.title}
          className={`w-full h-full ${project.image_fit === 'contain' ? 'object-contain' : 'object-cover'} opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0 ${project.image_position || 'object-center'}`}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Hover Circular Play/View Button centered inside image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-20 h-20 rounded-full border border-white/30 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 group-hover:border-white transition-all duration-500 transform scale-90 group-hover:scale-100 bg-black/20 backdrop-blur-sm">
           <Play fill="white" className="w-8 h-8 ml-1" />
        </div>
      </div>

      {/* Meta Information below the card */}
      <div className="flex flex-col gap-1 z-10 px-2">
        <h3 className="text-lg md:text-2xl font-serif text-white mb-1 leading-tight line-clamp-2 group-hover:text-accent transition-all duration-300">
          {project.title}
        </h3>
        <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] text-accent font-bold uppercase">
          {project.created_at ? new Date(project.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'Reciente'}
        </p>
        <div className="flex gap-2 flex-wrap mt-1">
           {project.tags.map(tag => (
             <span key={tag} className="text-[9px] md:text-[10px] font-sans border border-[#333] px-2 py-1 uppercase tracking-wider text-gray-400">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
}
