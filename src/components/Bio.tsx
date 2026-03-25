import { useEffect, useState, useRef } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const preventSnap = (e: WheelEvent) => {
      const isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight;
      if (!isScrollable) return;

      const isAtTop = scrollContainer.scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom = Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight) >= scrollContainer.scrollHeight && e.deltaY > 0;

      if (!isAtTop && !isAtBottom) {
        e.stopPropagation();
      }
    };

    scrollContainer.addEventListener('wheel', preventSnap, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', preventSnap);
  }, [bio]);

  if (loading) {
    return (
      <section id="section-bio" className="h-[100dvh] w-screen bg-[#080808] flex items-center justify-center">
        <div className="text-white font-sans opacity-50 tracking-widest uppercase text-sm">Cargando Bio...</div>
      </section>
    );
  }

  if (!bio) return null;
  
  return (
    <section id="section-bio" className="h-[100dvh] w-screen bg-[#080808] flex items-center pt-16 pb-6 lg:pt-20 lg:pb-10 px-[5vw] md:px-[8vw] lg:px-[10vw] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-16 items-center lg:items-center h-full overflow-hidden w-full">
        {/* Photo Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative group flex justify-center items-center shrink-0"
        >
          <div className="absolute -inset-2 lg:-inset-3 xl:-inset-4 border border-accent/20 translate-x-1 translate-y-1 lg:translate-x-2 lg:translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
          <div className="absolute -inset-2 lg:-inset-3 xl:-inset-4 border border-accent/40 -translate-x-1 -translate-y-1 lg:-translate-x-2 lg:-translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[25vh] lg:max-h-[55vh] xl:max-h-[60vh] aspect-square">
            <img 
              src={bio.photo_url} 
              alt="Bio" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-3 lg:gap-5 xl:gap-6 flex-1 min-h-0 h-full overflow-hidden"
        >
          <div className="flex flex-col min-h-0 overflow-hidden flex-1">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-serif italic text-white mb-3 lg:mb-4 border-l-4 border-accent pl-4 lg:pl-6 shrink-0">
              Bio
            </h2>
            <div 
              ref={scrollRef}
              tabIndex={0}
              className="text-gray-300 font-sans text-[11px] lg:text-[13px] xl:text-sm leading-relaxed opacity-80 prose prose-invert max-w-none overflow-y-auto pr-2 lg:pr-4 custom-scrollbar min-h-0 flex-1"
              dangerouslySetInnerHTML={{ __html: bio.review }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6 xl:gap-8 shrink-0 pb-2">
            <div>
              <div className="flex items-center gap-2 text-accent mb-2 lg:mb-3">
                <BookOpen size={14} className="lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]" />
                <h3 className="text-[10px] lg:text-[11px] xl:text-xs uppercase tracking-[0.2em] font-bold truncate">Estudios</h3>
              </div>
              <ul className="flex flex-col gap-1 lg:gap-1.5">
                {bio.studies?.slice(0, 3).map((study, i) => (
                  <li key={i} title={study} className="text-gray-400 text-[9px] lg:text-[11px] xl:text-xs font-sans border-l border-white/10 pl-3 lg:pl-4 py-0.5 lg:py-1 truncate">
                    {study}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-accent mb-2 lg:mb-3">
                <Award size={14} className="lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]" />
                <h3 className="text-[10px] lg:text-[11px] xl:text-xs uppercase tracking-[0.2em] font-bold truncate">Badges</h3>
              </div>
              <div className="flex flex-wrap gap-1 lg:gap-1.5 xl:gap-2">
                {bio.badges?.slice(0, 6).map((badge, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 px-2 lg:px-2.5 xl:px-3 py-0.5 lg:py-1 text-[8px] lg:text-[9px] xl:text-[10px] uppercase tracking-widest text-gray-400 hover:border-accent hover:text-white transition-colors truncate">
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
