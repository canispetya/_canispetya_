import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export interface Project {
  id: string;
  title: string;
  created_at: string;
  image_url: string;
  tags: string[];
  size: string;
  long_description: string;
  link_url?: string;
  image_position: string;
  image_fit?: 'cover' | 'contain';
  order_index: number;
}

export function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching projects:', error);
      } else if (data) {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative h-[100dvh] bg-[#050505] flex items-center px-[5vw] md:px-[10vw] py-16 md:py-24">
      <div className="absolute top-24 left-6 md:left-12 z-10 w-48 md:w-64">
        <h2 className="text-3xl md:text-4xl font-serif italic text-white opacity-90 border-l-4 border-accent pl-4">
          Proyectos importantes
        </h2>
      </div>

      <div className="flex gap-8 md:gap-16 items-center">
        {loading ? (
          <div className="text-white font-sans opacity-50 tracking-widest uppercase text-sm snap-center shrink-0">
            Cargando proyectos...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-white font-sans opacity-50 tracking-widest uppercase text-sm snap-center shrink-0">
            Aún no hay proyectos.
          </div>
        ) : (
          projects.map((project, index) => (
            <div key={project.id} id={index === 0 ? "first-project" : undefined} className="snap-center shrink-0">
              <ProjectCard 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))
        )}
      </div>

      {/* Pop-up Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
}
