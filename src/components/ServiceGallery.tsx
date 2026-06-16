import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ServiceCard } from './ServiceCard';
import { ServiceModal } from './ServiceModal';
import type { Service } from './ServiceCard';

export function ServiceGallery() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching services:', error);
      } else if (data) {
        setServices(data);
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  // Don't render the section if there are no services and not loading
  if (!loading && services.length === 0) return null;

  return (
    <section id="services" className="relative h-[100dvh] bg-[#050505] flex items-center px-[5vw] md:px-[10vw] py-16 md:py-24">
      <div className="absolute top-24 left-6 md:left-12 z-10 w-48 md:w-64">
        <h2 className="text-3xl md:text-4xl font-serif italic text-white opacity-90 border-l-4 border-accent pl-4">
          Mis Servicios
        </h2>
      </div>

      <div className="flex gap-8 md:gap-16 items-center">
        {loading ? (
          <div className="text-white font-sans opacity-50 tracking-widest uppercase text-sm snap-center shrink-0">
            Cargando servicios...
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="snap-center shrink-0">
              <ServiceCard 
                service={service} 
                onClick={() => setSelectedService(service)}
              />
            </div>
          ))
        )}
      </div>

      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </section>
  );
}
