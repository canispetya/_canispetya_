import { ProjectCard } from './ProjectCard';

const MOCK_PROJECTS = [
  {
    id: 1,
    title: '"E-Commerce" Next.js Release',
    date: 'OCT.25.2024',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
    tags: ['React', 'Supabase', 'Stripe'],
    size: 'large'
  },
  {
    id: 2,
    title: '"Portfolio" V1',
    date: 'SEP.12.2024',
    imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80',
    tags: ['Three.js', 'React'],
    size: 'medium'
  },
  {
    id: 3,
    title: '"SaaS Dashboard" Beta',
    date: 'AUG.05.2024',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    tags: ['Vue', 'Express', 'Postgres'],
    size: 'large'
  },
  {
    id: 4,
    title: '"Social Media App" Release',
    date: 'JUN.20.2024',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80',
    tags: ['React Native', 'Firebase'],
    size: 'small'
  }
];

export function ProjectGallery() {
  return (
    <section id="projects" className="relative h-screen bg-[#050505] flex items-center px-[10vw]">
      <div className="absolute top-24 left-12 z-10 w-64">
        <h2 className="text-4xl font-serif italic text-white opacity-90 border-l-4 border-accent pl-4">
          Selected Works
        </h2>
      </div>

      <div className="flex gap-16 items-center">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="shrink-0">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
