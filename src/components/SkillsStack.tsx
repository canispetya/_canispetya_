import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Code2, Server, Palette, Wrench, type LucideIcon } from 'lucide-react';

// Map DB icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Code2, Server, Palette, Wrench
};

interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: string[];
  order_index: number;
}

export function SkillsStack() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching skills:', error);
      } else if (data) {
        setCategories(data);
      }
      setLoading(false);
    }
    fetchSkills();
  }, []);

  // Scroll isolation: prevent wheel from triggering horizontal snap
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
  }, [categories]);

  if (loading) {
    return (
      <section id="section-skills" className="h-[100dvh] w-screen bg-[#080808] flex items-center justify-center">
        <div className="text-white font-sans opacity-50 tracking-widest uppercase text-sm">Cargando Stack...</div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section id="section-skills" className="h-[100dvh] w-screen bg-[#080808] flex flex-col overflow-hidden pt-14 lg:pt-20">
      {/* Scrollable content area — title inside so everything centers together */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-[5vw] md:px-[8vw] lg:px-[10vw] pb-6 flex flex-col justify-center"
      >
        <div className="max-w-5xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl lg:text-3xl xl:text-4xl font-serif italic text-white border-l-4 border-accent pl-4 lg:pl-6 mb-6 lg:mb-10"
          >
            Stack & Herramientas
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 w-full">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Category header — accent line style */}
              <div className="flex items-center gap-2.5 mb-4">
                {(() => {
                  const IconComponent = iconMap[category.icon];
                  return IconComponent 
                    ? <IconComponent size={16} className="text-accent/70 shrink-0" />
                    : <span className="text-base shrink-0">{category.icon}</span>;
                })()}
                <h3 className="text-[10px] lg:text-xs uppercase tracking-[0.2em] font-bold text-accent font-sans">
                  {category.title}
                </h3>
              </div>

              {/* Skills pills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: catIndex * 0.08 + skillIndex * 0.04 }}
                    viewport={{ once: true }}
                    className="
                      inline-flex items-center
                      px-3 py-1 lg:px-4 lg:py-1.5
                      rounded-full
                      bg-white/5 border border-white/10
                      text-[10px] lg:text-xs
                      font-sans tracking-wide text-gray-400
                      hover:scale-105 hover:border-accent/50 hover:text-white hover:bg-accent/10
                      transition-all duration-200 cursor-default select-none
                    "
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
