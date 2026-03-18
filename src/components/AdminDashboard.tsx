import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Edit2, Plus, X } from 'lucide-react';
import { DefaultEditor } from 'react-simple-wysiwyg';

interface Project {
  id: string;
  title: string;
  created_at: string;
  short_description: string;
  long_description: string;
  image_url: string;
  link_url?: string;
  tags: string[];
  size: string;
  image_position: string;
  image_fit?: 'cover' | 'contain';
  order_index: number;
  type: string;
}

interface BioData {
  id: string;
  review: string;
  photo_url: string;
  studies: string[];
  badges: string[];
}

export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [bioData, setBioData] = useState<BioData | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'bio'>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    long_description: '',
    image_url: '',
    link_url: '',
    tags: '', // comma separated string for input
    size: 'medium',
    image_position: 'object-center',
    image_fit: 'cover' as 'cover' | 'contain',
    order_index: 0,
    type: 'project'
  });

  const [bioFormData, setBioFormData] = useState({
    review: '',
    photo_url: '',
    studies: '', // new line separated
    badges: ''   // comma separated
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async (session: any) => {
      setSession(session);
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // STRICT EMAIL RESTRICTION
      const allowedEmail = 'nicko.pereira@gmail.com';
      if (session.user?.email !== allowedEmail) {
        console.error("Unauthorized access attempt:", session.user?.email);
        await supabase.auth.signOut();
        navigate('/admin/login?error=unauthorized');
        return;
      }

      fetchProjects();
      fetchBio();
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUser(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error fetching projects:', error);
    else if (data) setProjects(data);
    
    setLoading(false);
  };

  const fetchBio = async () => {
    const { data, error } = await supabase
      .from('bio')
      .select('*')
      .single();
    
    if (error) console.error('Error fetching bio:', error);
    else if (data) {
      setBioData(data);
      setBioFormData({
        review: data.review || '',
        photo_url: data.photo_url || '',
        studies: data.studies?.join('\n') || '',
        badges: data.badges?.join(', ') || ''
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWysiwygChange = (e: any) => {
    setFormData({ ...formData, long_description: e.target.value });
  };

  const handleBioInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBioFormData({ ...bioFormData, [e.target.name]: e.target.value });
  };

  const handleBioWysiwygChange = (e: any) => {
    setBioFormData({ ...bioFormData, review: e.target.value });
  };

  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      review: bioFormData.review,
      photo_url: bioFormData.photo_url,
      studies: bioFormData.studies.split('\n').map(s => s.trim()).filter(Boolean),
      badges: bioFormData.badges.split(',').map(b => b.trim()).filter(Boolean),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('bio')
      .update(payload)
      .eq('id', bioData?.id || '00000000-0000-0000-0000-000000000000');

    if (error) console.error("Bio update error:", error);
    
    fetchBio();
    setLoading(false);
    alert("Biografía actualizada correctamente");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      short_description: formData.short_description || null,
      long_description: formData.long_description || null,
      image_url: formData.image_url,
      link_url: formData.link_url || null,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      size: formData.size,
      image_position: formData.image_position,
      image_fit: formData.image_fit || 'cover',
      order_index: Number(formData.order_index) || 0,
      type: formData.type || 'project'
    };

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingId);
      if (error) console.error("Update error:", error);
    } else {
      // Insert new
      const { error } = await supabase
        .from('projects')
        .insert([payload]);
      if (error) console.error("Insert error:", error);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '', short_description: '', long_description: '', image_url: '', link_url: '', tags: '', size: 'medium', image_position: 'object-center', image_fit: 'cover', order_index: 0, type: 'project'
    });
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proyecto?")) return;
    setLoading(true);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error("Delete error:", error);
    fetchProjects();
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      short_description: project.short_description || '',
      long_description: project.long_description || '',
      image_url: project.image_url,
      link_url: project.link_url || '',
      tags: project.tags?.join(', ') || '',
      size: project.size || 'medium',
      image_position: project.image_position || 'object-center',
      image_fit: (project.image_fit as any) || 'cover',
      order_index: project.order_index || 0,
      type: project.type || 'project'
    });
    setShowForm(true);
  };

  if (loading && !session) return <div className="h-[100dvh] w-screen bg-[#020202] text-white flex items-center justify-center font-sans tracking-widest text-sm uppercase">Cargando Administrador...</div>;
  if (!session) return null;

  return (
    <div className="min-h-[100dvh] w-screen bg-[#020202] text-white p-6 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center border-b border-[#333] pb-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-widest uppercase">
            Panel de Administración
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-sans uppercase tracking-wider"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>

        <div className="flex gap-8 mb-8 border-b border-[#222]">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-2 text-xs font-sans uppercase tracking-[0.2em] transition-all ${activeTab === 'projects' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-white'}`}
          >
            Gestión de Proyectos
          </button>
          <button 
            onClick={() => setActiveTab('bio')}
            className={`pb-4 px-2 text-xs font-sans uppercase tracking-[0.2em] transition-all ${activeTab === 'bio' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-white'}`}
          >
            Mi Biografía
          </button>
        </div>

        {activeTab === 'projects' ? (
          showForm ? (
          <div className="bg-[#0a0a0a] border border-[#333] p-8 rounded-sm animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-serif italic text-accent">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
              <button 
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <label className="text-xs tracking-widest uppercase text-gray-400 font-bold text-accent">Tipo de Elemento</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="bg-black border-2 border-accent/40 p-3 text-white focus:border-accent outline-none font-bold">
                  <option value="project">Proyecto (Con ficha y detalles)</option>
                  <option value="decoration">Decoración (Solo imagen/gif)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-widest uppercase text-gray-400">{formData.type === 'project' ? 'Título *' : 'Nombre Interno (No se ve) *'}</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-widest uppercase text-gray-400">URL Imagen/Gif *</label>
                  <input required name="image_url" value={formData.image_url} onChange={handleInputChange} className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" />
                </div>
              </div>

              {formData.type === 'project' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs tracking-widest uppercase text-gray-400">Link del Proyecto Web (Opcional)</label>
                      <input name="link_url" value={formData.link_url} onChange={handleInputChange} placeholder="https://..." className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs tracking-widest uppercase text-gray-400">Tecnologías (separadas por coma)</label>
                      <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="React, Node.js, Supabase" className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase text-gray-400">Descripción Larga (Para el Pop-up)</label>
                    <div className="bg-black border border-[#333] text-white custom-editor">
                      <DefaultEditor value={formData.long_description} onChange={handleWysiwygChange} />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <label className="text-xs tracking-widest uppercase text-gray-400">Tamaño Tarjeta Galería</label>
                <select name="size" value={formData.size} onChange={handleInputChange} className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none">
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <label className="text-xs tracking-widest uppercase text-gray-400">Ajuste de Imagen</label>
                <select name="image_fit" value={formData.image_fit} onChange={handleInputChange} className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none">
                  <option value="cover">Recortar (Cover)</option>
                  <option value="contain">Mostrar Completa (Contain)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <label className="text-xs tracking-widest uppercase text-gray-400">Alineación (si es Recortar)</label>
                <select name="image_position" value={formData.image_position} onChange={handleInputChange} className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none">
                  <option value="object-center">Centro (Por Defecto)</option>
                  <option value="object-top">Arriba</option>
                  <option value="object-bottom">Abajo</option>
                  <option value="object-left">Izquierda</option>
                  <option value="object-right">Derecha</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <label className="text-xs tracking-widest uppercase text-gray-400">Orden (Número más bajo aparece primero)</label>
                <input type="number" name="order_index" value={formData.order_index} onChange={handleInputChange} className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" />
              </div>

              <button type="submit" disabled={loading} className="mt-4 w-fit bg-white text-black px-8 py-3 font-sans uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
                {loading ? 'Guardando...' : (editingId ? 'Actualizar Proyecto' : 'Guardar Proyecto')}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-serif italic opacity-80">Inventario de Proyectos</h2>
              <button 
                onClick={() => {
                  setFormData({ title: '', short_description: '', long_description: '', image_url: '', link_url: '', tags: '', size: 'medium', image_position: 'object-center', image_fit: 'cover', order_index: 0, type: 'project' });
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 font-sans uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} /> Nuevo
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500 font-sans text-sm">Cargando proyectos...</p>
            ) : projects.length === 0 ? (
              <div className="bg-[#0a0a0a] border border-[#222] p-12 text-center text-gray-500 font-sans">
                Aún no hay proyectos en la base de datos. ¡Crea el primero!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-[#0a0a0a] border border-[#222] flex flex-col group">
                    <div className="h-48 w-full relative overflow-hidden bg-black">
                      <img src={project.image_url} alt={project.title} className={`w-full h-full ${project.image_fit === 'contain' ? 'object-contain' : 'object-cover'} opacity-60 group-hover:opacity-100 transition-opacity ${project.image_position || 'object-center'}`} />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-serif mb-1 truncate">{project.title}</h3>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-xs text-accent font-sans tracking-widest uppercase">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${project.type === 'decoration' ? 'border-purple-500 text-purple-400' : 'border-blue-500 text-blue-400'} uppercase font-sans tracking-tighter`}>
                          {project.type === 'decoration' ? 'Decoración' : 'Proyecto'}
                        </span>
                      </div>
                      <div className="mt-auto flex justify-end gap-3 pt-4 border-t border-[#222]">
                        <button onClick={() => startEdit(project)} className="text-gray-400 hover:text-white p-2 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )) : (
          <div className="bg-[#0a0a0a] border border-[#333] p-8 rounded-sm">
            <h2 className="text-xl font-serif italic text-accent mb-8">Editar Biografía</h2>
            <form onSubmit={handleBioSubmit} className="flex flex-col gap-6 font-sans">
              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-widest uppercase text-gray-400">Foto de Perfil (URL)</label>
                <input 
                  name="photo_url" 
                  value={bioFormData.photo_url} 
                  onChange={handleBioInputChange} 
                  required
                  className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-widest uppercase text-gray-400">Reseña / Bio</label>
                <div className="bg-black border border-[#333] text-white custom-editor">
                  <DefaultEditor value={bioFormData.review} onChange={handleBioWysiwygChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-widest uppercase text-gray-400">Estudios (uno por línea)</label>
                  <textarea 
                    name="studies" 
                    value={bioFormData.studies} 
                    onChange={handleBioInputChange} 
                    rows={5}
                    className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none font-sans" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-widest uppercase text-gray-400">Badges / Skills (separados por coma)</label>
                  <input 
                    name="badges" 
                    value={bioFormData.badges} 
                    onChange={handleBioInputChange} 
                    className="bg-black border border-[#333] p-3 text-white focus:border-accent outline-none" 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="mt-4 w-fit bg-white text-black px-8 py-3 font-sans uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
                {loading ? 'Guardando...' : 'Actualizar Biografía'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
