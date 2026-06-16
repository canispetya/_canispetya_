import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Trash2, Edit2, Plus, X, FolderKanban, User, Wrench, 
  Briefcase, LayoutDashboard, ChevronRight, Layers, Image, 
  Link as LinkIcon, Tags, GripVertical, Type, AlignLeft
} from 'lucide-react';
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

interface Service {
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

interface BioData {
  id: string;
  review: string;
  photo_url: string;
  studies: string[];
  badges: string[];
}

interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: string[];
  order_index: number;
}

type TabType = 'projects' | 'services' | 'bio' | 'skills';

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'projects', label: 'Proyectos', icon: <FolderKanban size={18} /> },
  { key: 'services', label: 'Servicios', icon: <Briefcase size={18} /> },
  { key: 'bio', label: 'Biografía', icon: <User size={18} /> },
  { key: 'skills', label: 'Stack & Skills', icon: <Wrench size={18} /> },
];

/* ─────────────────────────── Stat Card ─────────────────────────── */
function StatCard({ label, value, icon, accentColor = 'accent' }: { label: string; value: number | string; icon: React.ReactNode; accentColor?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 hover:border-${accentColor}/30 transition-all duration-500`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-white tracking-tight">{value}</p>
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Input Field ──────────────────────── */
function InputField({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-gray-500 font-sans font-medium">
        {icon && <span className="text-accent/60">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm font-sans placeholder:text-gray-600 focus:border-accent/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent/20 outline-none transition-all duration-300";
const selectClass = inputClass;

/* ═══════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — MODERNIZED
   ═══════════════════════════════════════════════════════════════════ */
export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bioData, setBioData] = useState<BioData | null>(null);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Project Form State
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    long_description: '',
    image_url: '',
    link_url: '',
    tags: '',
    size: 'medium',
    image_position: 'object-center',
    image_fit: 'cover' as 'cover' | 'contain',
    order_index: 0,
    type: 'project'
  });

  // Service Form State
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    short_description: '',
    long_description: '',
    image_url: '',
    icon: '🔧',
    link_url: '',
    tags: '',
    size: 'medium',
    image_position: 'object-center',
    image_fit: 'cover' as 'cover' | 'contain',
    order_index: 0,
  });

  const [bioFormData, setBioFormData] = useState({
    review: '',
    photo_url: '',
    studies: '',
    badges: ''
  });

  const navigate = useNavigate();

  /* ──────────── Auth ──────────── */
  useEffect(() => {
    const checkUser = async (session: any) => {
      setSession(session);
      if (!session) {
        navigate('/admin/login');
        return;
      }
      const allowedEmail = 'nicko.pereira@gmail.com';
      if (session.user?.email !== allowedEmail) {
        console.error("Unauthorized access attempt:", session.user?.email);
        await supabase.auth.signOut();
        navigate('/admin/login?error=unauthorized');
        return;
      }
      fetchProjects();
      fetchServices();
      fetchBio();
      fetchSkillCategories();
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUser(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  /* ──────────── Fetch ──────────── */
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

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching services:', error);
    else if (data) setServices(data);
  };

  const fetchBio = async () => {
    const { data, error } = await supabase.from('bio').select('*').single();
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

  const fetchSkillCategories = async () => {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) console.error('Error fetching skills:', error);
    else if (data) setSkillCategories(data);
  };

  /* ──────────── Handlers: Skills ──────────── */
  const handleSkillCategoryUpdate = async (category: SkillCategory) => {
    const { error } = await supabase
      .from('skill_categories')
      .update({ title: category.title, icon: category.icon, skills: category.skills, order_index: category.order_index })
      .eq('id', category.id);
    if (error) { console.error('Update error:', error); alert('Error: ' + error.message); }
    else fetchSkillCategories();
  };

  const handleSkillCategoryAdd = async () => {
    const { error } = await supabase
      .from('skill_categories')
      .insert([{ title: 'Nueva Categoría', icon: '🔧', skills: [], order_index: skillCategories.length }]);
    if (error) { console.error('Insert error:', error); alert('Error: ' + error.message); }
    else fetchSkillCategories();
  };

  const handleSkillCategoryDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    const { error } = await supabase.from('skill_categories').delete().eq('id', id);
    if (error) console.error('Delete error:', error);
    else fetchSkillCategories();
  };

  /* ──────────── Handlers: Projects ──────────── */
  const handleLogout = async () => { await supabase.auth.signOut(); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWysiwygChange = (e: any) => {
    setFormData({ ...formData, long_description: e.target.value });
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
      const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from('projects').insert([payload]);
      if (error) console.error("Insert error:", error);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', short_description: '', long_description: '', image_url: '', link_url: '', tags: '', size: 'medium', image_position: 'object-center', image_fit: 'cover', order_index: 0, type: 'project' });
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

  /* ──────────── Handlers: Services ──────────── */
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setServiceFormData({ ...serviceFormData, [e.target.name]: e.target.value });
  };

  const handleServiceWysiwygChange = (e: any) => {
    setServiceFormData({ ...serviceFormData, long_description: e.target.value });
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: serviceFormData.title,
      short_description: serviceFormData.short_description || null,
      long_description: serviceFormData.long_description || null,
      image_url: serviceFormData.image_url,
      icon: serviceFormData.icon || '🔧',
      link_url: serviceFormData.link_url || null,
      tags: serviceFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      size: serviceFormData.size,
      image_position: serviceFormData.image_position,
      image_fit: serviceFormData.image_fit || 'cover',
      order_index: Number(serviceFormData.order_index) || 0,
    };

    if (editingId) {
      const { error } = await supabase.from('services').update(payload).eq('id', editingId);
      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from('services').insert([payload]);
      if (error) console.error("Insert error:", error);
    }

    setShowForm(false);
    setEditingId(null);
    setServiceFormData({ title: '', short_description: '', long_description: '', image_url: '', icon: '🔧', link_url: '', tags: '', size: 'medium', image_position: 'object-center', image_fit: 'cover', order_index: 0 });
    fetchServices();
  };

  const handleServiceDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    setLoading(true);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) console.error("Delete error:", error);
    fetchServices();
  };

  const startServiceEdit = (service: Service) => {
    setEditingId(service.id);
    setServiceFormData({
      title: service.title,
      short_description: service.short_description || '',
      long_description: service.long_description || '',
      image_url: service.image_url,
      icon: service.icon || '🔧',
      link_url: service.link_url || '',
      tags: service.tags?.join(', ') || '',
      size: service.size || 'medium',
      image_position: service.image_position || 'object-center',
      image_fit: (service.image_fit as any) || 'cover',
      order_index: service.order_index || 0,
    });
    setShowForm(true);
  };

  /* ──────────── Handlers: Bio ──────────── */
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
      id: bioData?.id || '00000000-0000-0000-0000-000000000000',
      review: bioFormData.review,
      photo_url: bioFormData.photo_url,
      studies: bioFormData.studies.split('\n').map(s => s.trim()).filter(Boolean),
      badges: bioFormData.badges.split(',').map(b => b.trim()).filter(Boolean),
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('bio').upsert(payload);
    if (error) {
      console.error("Bio update error:", error);
      alert("Error al guardar: " + error.message);
    } else {
      await fetchBio();
      alert("Biografía actualizada correctamente");
    }
    setLoading(false);
  };

  /* ──────────── Loading / Auth ──────────── */
  if (loading && !session) return (
    <div className="h-[100dvh] w-screen bg-[#030303] text-white flex flex-col items-center justify-center font-sans gap-4">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      <span className="tracking-[0.3em] text-[10px] uppercase text-gray-500">Cargando Panel</span>
    </div>
  );
  if (!session) return null;

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-[100dvh] w-screen bg-[#030303] text-white flex flex-col lg:flex-row overflow-hidden">

      {/* ───── Mobile Header ───── */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
          <LayoutDashboard size={20} />
        </button>
        <h1 className="text-sm font-display font-bold tracking-[0.15em] uppercase text-glow">CANISPETYA</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-accent transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      {/* ───── Sidebar ───── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a]/95 backdrop-blur-2xl border-r border-white/[0.06] 
        flex flex-col transform transition-transform duration-300 ease-out
        lg:relative lg:translate-x-0 lg:w-72
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="p-6 pb-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-display font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-sm font-display font-bold tracking-[0.1em] uppercase">CANISPETYA</h1>
              <p className="text-[9px] text-gray-600 font-sans tracking-wider uppercase">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowForm(false); setEditingId(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                activeTab === tab.key 
                  ? 'bg-accent/10 text-accent border border-accent/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className={`transition-colors ${activeTab === tab.key ? 'text-accent' : 'text-gray-600 group-hover:text-gray-400'}`}>
                {tab.icon}
              </span>
              <span className="text-xs font-sans tracking-[0.1em] uppercase font-medium">{tab.label}</span>
              <ChevronRight size={14} className={`ml-auto transition-all ${activeTab === tab.key ? 'text-accent/60 translate-x-0 opacity-100' : 'opacity-0 -translate-x-2'}`} />
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
              <User size={14} className="text-accent" />
            </div>
            <span className="text-[10px] text-gray-500 font-sans truncate">{session?.user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-accent text-[10px] font-sans uppercase tracking-[0.15em] py-2.5 rounded-lg border border-white/[0.06] hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ───── Main Content ───── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">

          {/* Page Title + Stats */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-gray-600 text-[10px] font-sans tracking-[0.2em] uppercase mb-2">
              <LayoutDashboard size={12} /> 
              <span>Dashboard</span> 
              <ChevronRight size={10} /> 
              <span className="text-accent">{TABS.find(t => t.key === activeTab)?.label}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
              {TABS.find(t => t.key === activeTab)?.label}
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Proyectos" value={projects.length} icon={<FolderKanban size={18} />} />
            <StatCard label="Servicios" value={services.length} icon={<Briefcase size={18} />} />
            <StatCard label="Skills" value={skillCategories.reduce((sum, c) => sum + c.skills.length, 0)} icon={<Layers size={18} />} />
            <StatCard label="Categorías" value={skillCategories.length} icon={<Wrench size={18} />} />
          </div>

          {/* ═══════════ TAB: PROJECTS ═══════════ */}
          {activeTab === 'projects' && (
            showForm ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                    <p className="text-[10px] text-gray-600 font-sans tracking-wider uppercase mt-1">Completa los campos requeridos</p>
                  </div>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }} className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
                  <InputField label="Tipo de Elemento" icon={<Tags size={12} />}>
                    <select name="type" value={formData.type} onChange={handleInputChange} className={selectClass}>
                      <option value="project">Proyecto (Con ficha y detalles)</option>
                      <option value="decoration">Decoración (Solo imagen/gif)</option>
                    </select>
                  </InputField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label={formData.type === 'project' ? 'Título *' : 'Nombre Interno *'} icon={<Type size={12} />}>
                      <input required name="title" value={formData.title} onChange={handleInputChange} className={inputClass} placeholder="Nombre del proyecto" />
                    </InputField>
                    <InputField label="URL Imagen/Gif *" icon={<Image size={12} />}>
                      <input required name="image_url" value={formData.image_url} onChange={handleInputChange} className={inputClass} placeholder="https://..." />
                    </InputField>
                  </div>

                  {formData.type === 'project' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Link del Proyecto (Opcional)" icon={<LinkIcon size={12} />}>
                          <input name="link_url" value={formData.link_url} onChange={handleInputChange} placeholder="https://..." className={inputClass} />
                        </InputField>
                        <InputField label="Tecnologías (separadas por coma)" icon={<Tags size={12} />}>
                          <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="React, Node.js, Supabase" className={inputClass} />
                        </InputField>
                      </div>

                      <InputField label="Descripción Larga (Pop-up)" icon={<AlignLeft size={12} />}>
                        <div className="rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.03] custom-editor">
                          <DefaultEditor value={formData.long_description} onChange={handleWysiwygChange} />
                        </div>
                      </InputField>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Tamaño Tarjeta">
                      <select name="size" value={formData.size} onChange={handleInputChange} className={selectClass}>
                        <option value="small">Pequeño</option>
                        <option value="medium">Mediano</option>
                        <option value="large">Grande</option>
                      </select>
                    </InputField>
                    <InputField label="Ajuste de Imagen">
                      <select name="image_fit" value={formData.image_fit} onChange={handleInputChange} className={selectClass}>
                        <option value="cover">Recortar (Cover)</option>
                        <option value="contain">Completa (Contain)</option>
                      </select>
                    </InputField>
                    <InputField label="Alineación">
                      <select name="image_position" value={formData.image_position} onChange={handleInputChange} className={selectClass}>
                        <option value="object-center">Centro</option>
                        <option value="object-top">Arriba</option>
                        <option value="object-bottom">Abajo</option>
                        <option value="object-left">Izquierda</option>
                        <option value="object-right">Derecha</option>
                      </select>
                    </InputField>
                    <InputField label="Orden" icon={<GripVertical size={12} />}>
                      <input type="number" name="order_index" value={formData.order_index} onChange={handleInputChange} className={inputClass} />
                    </InputField>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                    <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-sans uppercase tracking-[0.15em] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 disabled:opacity-50">
                      {loading ? 'Guardando...' : (editingId ? 'Actualizar Proyecto' : 'Guardar Proyecto')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-sm text-gray-500 font-sans">
                    {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} en total
                  </p>
                  <button 
                    onClick={() => {
                      setFormData({ title: '', short_description: '', long_description: '', image_url: '', link_url: '', tags: '', size: 'medium', image_position: 'object-center', image_fit: 'cover', order_index: 0, type: 'project' });
                      setEditingId(null);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-sans uppercase tracking-[0.15em] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
                  >
                    <Plus size={16} /> Nuevo
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] p-16 text-center">
                    <FolderKanban size={40} className="mx-auto mb-4 text-gray-700" />
                    <p className="text-gray-500 font-sans text-sm">Aún no hay proyectos.</p>
                    <p className="text-gray-700 font-sans text-xs mt-1">¡Crea el primero!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {projects.map((project, i) => (
                      <div 
                        key={project.id} 
                        className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="h-44 w-full relative overflow-hidden bg-black">
                          <img src={project.image_url} alt={project.title} className={`w-full h-full ${project.image_fit === 'contain' ? 'object-contain' : 'object-cover'} opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ${project.image_position || 'object-center'}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                          <span className={`absolute top-3 right-3 text-[9px] px-2.5 py-1 rounded-full font-sans tracking-wider uppercase backdrop-blur-sm ${project.type === 'decoration' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                            {project.type === 'decoration' ? 'Decoración' : 'Proyecto'}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="text-sm font-display font-bold text-white mb-1 truncate group-hover:text-accent transition-colors">{project.title}</h3>
                          <p className="text-[10px] text-gray-600 font-sans tracking-wider">
                            {new Date(project.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <span className="ml-2 text-gray-700">Orden: {project.order_index}</span>
                          </p>
                          <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-white/[0.04]">
                            <button onClick={() => startEdit(project)} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-accent hover:border-accent/30 transition-all">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* ═══════════ TAB: SERVICES ═══════════ */}
          {activeTab === 'services' && (
            showForm ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                    <p className="text-[10px] text-gray-600 font-sans tracking-wider uppercase mt-1">Define los detalles del servicio</p>
                  </div>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }} className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleServiceSubmit} className="flex flex-col gap-6 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Título del Servicio *" icon={<Type size={12} />}>
                      <input required name="title" value={serviceFormData.title} onChange={handleServiceInputChange} className={inputClass} placeholder="Ej: Desarrollo Web" />
                    </InputField>
                    <InputField label="Ícono (Emoji)" icon={<span className="text-sm">✨</span>}>
                      <input name="icon" value={serviceFormData.icon} onChange={handleServiceInputChange} className={inputClass} placeholder="🔧" />
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="URL Imagen *" icon={<Image size={12} />}>
                      <input required name="image_url" value={serviceFormData.image_url} onChange={handleServiceInputChange} className={inputClass} placeholder="https://..." />
                    </InputField>
                    <InputField label="Link Externo (Opcional)" icon={<LinkIcon size={12} />}>
                      <input name="link_url" value={serviceFormData.link_url} onChange={handleServiceInputChange} placeholder="https://..." className={inputClass} />
                    </InputField>
                  </div>

                  <InputField label="Descripción Corta" icon={<AlignLeft size={12} />}>
                    <input name="short_description" value={serviceFormData.short_description} onChange={handleServiceInputChange} className={inputClass} placeholder="Breve descripción visible en la card" />
                  </InputField>

                  <InputField label="Tecnologías / Categorías (separadas por coma)" icon={<Tags size={12} />}>
                    <input name="tags" value={serviceFormData.tags} onChange={handleServiceInputChange} placeholder="React, Node.js, Supabase" className={inputClass} />
                  </InputField>

                  <InputField label="Descripción Larga (Pop-up)" icon={<AlignLeft size={12} />}>
                    <div className="rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.03] custom-editor">
                      <DefaultEditor value={serviceFormData.long_description} onChange={handleServiceWysiwygChange} />
                    </div>
                  </InputField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="Tamaño Tarjeta">
                      <select name="size" value={serviceFormData.size} onChange={handleServiceInputChange} className={selectClass}>
                        <option value="small">Pequeño</option>
                        <option value="medium">Mediano</option>
                        <option value="large">Grande</option>
                      </select>
                    </InputField>
                    <InputField label="Ajuste de Imagen">
                      <select name="image_fit" value={serviceFormData.image_fit} onChange={handleServiceInputChange} className={selectClass}>
                        <option value="cover">Recortar (Cover)</option>
                        <option value="contain">Completa (Contain)</option>
                      </select>
                    </InputField>
                    <InputField label="Alineación">
                      <select name="image_position" value={serviceFormData.image_position} onChange={handleServiceInputChange} className={selectClass}>
                        <option value="object-center">Centro</option>
                        <option value="object-top">Arriba</option>
                        <option value="object-bottom">Abajo</option>
                        <option value="object-left">Izquierda</option>
                        <option value="object-right">Derecha</option>
                      </select>
                    </InputField>
                    <InputField label="Orden" icon={<GripVertical size={12} />}>
                      <input type="number" name="order_index" value={serviceFormData.order_index} onChange={handleServiceInputChange} className={inputClass} />
                    </InputField>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                    <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-sans uppercase tracking-[0.15em] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 disabled:opacity-50">
                      {loading ? 'Guardando...' : (editingId ? 'Actualizar Servicio' : 'Guardar Servicio')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-sm text-gray-500 font-sans">
                    {services.length} {services.length === 1 ? 'servicio' : 'servicios'} en total
                  </p>
                  <button 
                    onClick={() => {
                      setServiceFormData({ title: '', short_description: '', long_description: '', image_url: '', icon: '🔧', link_url: '', tags: '', size: 'medium', image_position: 'object-center', image_fit: 'cover', order_index: 0 });
                      setEditingId(null);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-sans uppercase tracking-[0.15em] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
                  >
                    <Plus size={16} /> Nuevo
                  </button>
                </div>

                {services.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] p-16 text-center">
                    <Briefcase size={40} className="mx-auto mb-4 text-gray-700" />
                    <p className="text-gray-500 font-sans text-sm">Aún no hay servicios.</p>
                    <p className="text-gray-700 font-sans text-xs mt-1">¡Crea el primero!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {services.map((service, i) => (
                      <div 
                        key={service.id} 
                        className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="h-44 w-full relative overflow-hidden bg-black">
                          <img src={service.image_url} alt={service.title} className={`w-full h-full ${service.image_fit === 'contain' ? 'object-contain' : 'object-cover'} opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ${service.image_position || 'object-center'}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 text-xl">{service.icon}</span>
                          <span className="absolute top-3 right-3 text-[9px] px-2.5 py-1 rounded-full font-sans tracking-wider uppercase backdrop-blur-sm bg-accent/20 text-accent border border-accent/30">
                            Servicio
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="text-sm font-display font-bold text-white mb-1 truncate group-hover:text-accent transition-colors">{service.title}</h3>
                          {service.short_description && (
                            <p className="text-[10px] text-gray-500 font-sans line-clamp-2 mb-1">{service.short_description}</p>
                          )}
                          <p className="text-[10px] text-gray-600 font-sans tracking-wider">
                            {new Date(service.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <span className="ml-2 text-gray-700">Orden: {service.order_index}</span>
                          </p>
                          <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-white/[0.04]">
                            <button onClick={() => startServiceEdit(service)} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-accent hover:border-accent/30 transition-all">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleServiceDelete(service.id)} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* ═══════════ TAB: BIO ═══════════ */}
          {activeTab === 'bio' && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-lg font-display font-bold text-white">Editar Biografía</h3>
                <p className="text-[10px] text-gray-600 font-sans tracking-wider uppercase mt-1">Información personal y académica</p>
              </div>
              <form onSubmit={handleBioSubmit} className="flex flex-col gap-6 font-sans">
                <InputField label="Foto de Perfil (URL)" icon={<Image size={12} />}>
                  <input name="photo_url" value={bioFormData.photo_url} onChange={handleBioInputChange} required className={inputClass} />
                </InputField>

                <InputField label="Reseña / Bio" icon={<AlignLeft size={12} />}>
                  <div className="rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.03] custom-editor">
                    <DefaultEditor value={bioFormData.review} onChange={handleBioWysiwygChange} />
                  </div>
                </InputField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Estudios (uno por línea)">
                    <textarea name="studies" value={bioFormData.studies} onChange={handleBioInputChange} rows={5} className={inputClass + ' resize-none'} />
                  </InputField>
                  <InputField label="Badges / Skills (separados por coma)">
                    <input name="badges" value={bioFormData.badges} onChange={handleBioInputChange} className={inputClass} />
                  </InputField>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                  <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-sans uppercase tracking-[0.15em] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 disabled:opacity-50">
                    {loading ? 'Guardando...' : 'Actualizar Biografía'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════ TAB: SKILLS ═══════════ */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500 font-sans">
                  {skillCategories.length} {skillCategories.length === 1 ? 'categoría' : 'categorías'}
                </p>
                <button
                  onClick={handleSkillCategoryAdd}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-sans uppercase tracking-[0.15em] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
                >
                  <Plus size={16} /> Nueva Categoría
                </button>
              </div>

              {skillCategories.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <input
                      value={cat.icon}
                      onChange={(e) => {
                        const updated = skillCategories.map(c => c.id === cat.id ? { ...c, icon: e.target.value } : c);
                        setSkillCategories(updated);
                      }}
                      className="w-14 h-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-center text-lg text-white focus:border-accent/50 outline-none transition-all"
                      placeholder="🔧"
                    />
                    <input
                      value={cat.title}
                      onChange={(e) => {
                        const updated = skillCategories.map(c => c.id === cat.id ? { ...c, title: e.target.value } : c);
                        setSkillCategories(updated);
                      }}
                      className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent/50 outline-none transition-all font-sans"
                      placeholder="Nombre de categoría"
                    />
                    <input
                      type="number"
                      value={cat.order_index}
                      onChange={(e) => {
                        const updated = skillCategories.map(c => c.id === cat.id ? { ...c, order_index: Number(e.target.value) } : c);
                        setSkillCategories(updated);
                      }}
                      className="w-20 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm text-center focus:border-accent/50 outline-none transition-all font-sans"
                      title="Orden"
                    />
                    <button
                      onClick={() => handleSkillCategoryDelete(cat.id)}
                      className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-gray-600 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {cat.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-3.5 py-1.5 group/pill hover:border-accent/30 transition-all">
                        <span className="text-xs text-gray-300 font-sans">{skill}</span>
                        <button
                          onClick={() => {
                            const updated = skillCategories.map(c =>
                              c.id === cat.id ? { ...c, skills: c.skills.filter((_, idx) => idx !== i) } : c
                            );
                            setSkillCategories(updated);
                          }}
                          className="text-gray-700 hover:text-red-400 transition-colors ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newSkill = window.prompt('Nombre del skill:');
                        if (!newSkill?.trim()) return;
                        const updated = skillCategories.map(c =>
                          c.id === cat.id ? { ...c, skills: [...c.skills, newSkill.trim()] } : c
                        );
                        setSkillCategories(updated);
                      }}
                      className="flex items-center gap-1.5 border border-dashed border-white/[0.12] rounded-full px-3.5 py-1.5 text-xs text-gray-600 hover:text-accent hover:border-accent/40 transition-all font-sans"
                    >
                      <Plus size={12} /> Agregar
                    </button>
                  </div>

                  <button
                    onClick={() => handleSkillCategoryUpdate(cat)}
                    className="text-[10px] font-sans uppercase tracking-[0.15em] text-accent hover:text-white border border-accent/30 px-5 py-2.5 rounded-lg hover:bg-accent/10 transition-all duration-300"
                  >
                    Guardar Categoría
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
