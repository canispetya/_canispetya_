import { Play } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  tags: string[];
  size: string; // 'small', 'medium', 'large'
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Determine dimensions based on size mimicking the asymmetric layout
  const dimensions = {
    small: 'w-[300px] h-[400px]',
    medium: 'w-[450px] h-[600px]',
    large: 'w-[800px] h-[500px]',
  }[project.size] || 'w-[500px] h-[500px]';

  return (
    <div className={`group relative flex flex-col gap-4 cursor-pointer indicator-container ${dimensions}`}>
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden border border-[#222] bg-black">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
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
      <div className="flex flex-col gap-1 z-10">
        <h3 className="text-2xl font-serif text-white group-hover:text-glow transition-all">
          {project.title}
        </h3>
        <p className="text-xs font-sans tracking-[0.2em] text-accent font-bold uppercase">
          {project.date}
        </p>
        <div className="flex gap-2 mt-2">
           {project.tags.map(tag => (
             <span key={tag} className="text-[10px] font-sans border border-[#333] px-2 py-1 uppercase tracking-wider text-gray-400">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
}
