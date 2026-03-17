import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface BioData {
  review: string;
  photo_url: string;
  studies: string[];
  badges: string[];
}

export function Bio() {
  const [bio, setBio] = useState<BioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBio() {
      const { data, error } = await supabase
        .from('bio')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching bio:', error);
      } else if (data) {
        setBio(data);
      }
      setLoading(false);
    }
    fetchBio();
  }, []);

  if (loading) {
    return (
      <section id="section-bio" className="h-[100dvh] w-screen bg-[#080808] flex items-center justify-center">
        <div className="text-white font-sans opacity-50 tracking-widest uppercase text-sm">Cargando Bio...</div>
      </section>
    );
  }

  if (!bio) return null;

  return (
    <section id="section-bio" className="min-h-[100dvh] w-screen bg-[#080808] flex items-center py-20 px-[5vw] md:px-[10vw]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Photo with frame/glitch aesthetic */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-4 border border-accent/20 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
          <div className="absolute -inset-4 border border-accent/40 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative aspect-square overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
            <img 
              src={bio.photo_url} 
              alt="Bio" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-6 border-l-4 border-accent pl-6">
              Bio
            </h2>
            <div 
              className="text-gray-300 font-sans text-sm md:text-base leading-relaxed opacity-80 mb-8 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: bio.review }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Studies */}
            <div>
              <div className="flex items-center gap-3 text-accent mb-4">
                <BookOpen size={20} />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Estudios</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {bio.studies?.map((study, i) => (
                  <li key={i} className="text-gray-400 text-sm font-sans border-l border-[#333] pl-4 py-1">
                    {study}
                  </li>
                ))}
              </ul>
            </div>

            {/* Badges/Badges */}
            <div>
              <div className="flex items-center gap-3 text-accent mb-4">
                <Award size={20} />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Badges</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {bio.badges?.map((badge, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-400 hover:border-accent hover:text-white transition-colors">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
