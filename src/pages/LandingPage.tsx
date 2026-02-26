import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  MapPin,
  ChevronRight,
  Filter,
  Lock,
  Newspaper,
  Image as ImageIcon,
  LogIn,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSite } from '../context/SiteContext';

const sportsList = [
  { name: 'Football', emoji: '⚽', desc: 'Technical drills & match play.' },
  { name: 'Basketball', emoji: '🏀', desc: 'Foundational hoops training.' },
  { name: 'Volleyball', emoji: '🏐', desc: 'Skill-based serve & volley.' },
  { name: 'Scrabbles', emoji: '🔠', desc: 'Cognitive strategy sessions.' },
  { name: 'Table Tennis', emoji: '🏓', desc: 'Reflex and agility training.' }
];

const ITEMS_PER_PAGE = 10;

export function LandingPage() {
  const { athletes, blogPosts, galleryImages, loading } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // --- SORTING LOGIC FOR FEATURED NEWS ---
  const sortedNews = useMemo(() => {
    if (!blogPosts) return [];
    return [...blogPosts].sort((a, b) => {
      // 1. Featured posts first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      // 2. Then by date (newest first)
      const dateA = a.createdAt?.toMillis() || 0;
      const dateB = b.createdAt?.toMillis() || 0;
      return dateB - dateA;
    });
  }, [blogPosts]);

  const stats = useMemo(() => {
    const list = athletes || [];
    const sportsCounts = sportsList.reduce((acc, s) => {
      acc[s.name] = list.filter((a: any) => a.sport === s.name).length;
      return acc;
    }, {} as Record<string, number>);
    return { total: list.length, sportsCounts };
  }, [athletes]);

  const filteredAthletes = useMemo(() => {
    return (athletes || []).filter((a: any) => {
      const q = searchQuery.toLowerCase();
      const fullName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q) || a.homeAddress?.toLowerCase().includes(q);
      const matchSport = filterSport === 'All' || a.sport === filterSport;
      return matchSearch && matchSport;
    });
  }, [athletes, searchQuery, filterSport]);

  const displayedAthletes = filteredAthletes.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-amber-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src="/IfeYouth.jpg" alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-8 uppercase italic">
              Train <br /><span className="text-amber-400">Harder.</span>
            </h1>
            <p className="text-slate-300 text-xl md:text-2xl mb-12 max-w-2xl font-medium leading-relaxed">
              Ife Youth Sports Camp 2026. High-performance training for the next generation of champions.
            </p>
            <div className="flex flex-wrap gap-4">
               <a href="#directory" className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-3 shadow-2xl uppercase tracking-tight">
                Explore Trainees <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <CountdownTimer />

      {/* --- TRAINING TRACKS --- */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">Training Tracks</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Verified Enrollment Data</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
            {sportsList.map((sport) => (
              <motion.div 
                key={sport.name}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setFilterSport(sport.name);
                  document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-8 rounded-[2rem] border transition-all cursor-pointer ${
                  filterSport === sport.name ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="text-4xl mb-6">{sport.emoji}</div>
                <h3 className={`text-sm font-black uppercase tracking-tighter mb-2 ${filterSport === sport.name ? 'text-white' : 'text-slate-900'}`}>{sport.name}</h3>
                <p className={`text-3xl font-black ${filterSport === sport.name ? 'text-amber-400' : 'text-slate-300'}`}>
                  {stats.sportsCounts[sport.name] || 0}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MEDIA & GALLERY SECTION --- */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-7 space-y-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic flex items-center gap-3">
                <Newspaper className="text-amber-500" /> Training News
              </h2>
            </div>
            
            <div className="space-y-10">
              {sortedNews.length > 0 ? sortedNews.map((post: any, i: number) => (
                <div key={post.id || i} className="group cursor-pointer flex flex-col md:flex-row gap-8 items-start relative">
                  <div className="w-full md:w-56 h-40 rounded-3xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 relative">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    {post.isFeatured && (
                      <div className="absolute top-4 left-4 bg-amber-400 text-[#0F172A] p-2 rounded-xl shadow-lg">
                        <Star size={16} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{post.category || 'General'}</span>
                      {post.isFeatured && <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase">Pinned Update</span>}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3 leading-tight uppercase italic group-hover:text-amber-600 transition-colors">{post.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">{post.excerpt}</p>
                  </div>
                </div>
              )) : (
                <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-400 font-bold uppercase text-xs">No News Updates Available</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic flex items-center gap-3">
               <ImageIcon /> Gallery
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages?.length > 0 ? galleryImages.slice(0, 4).map((img: any, i: number) => (
                <div key={i} className={`rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-sm ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`}>
                  <img src={img.url || img} className="w-full h-full object-cover hover:scale-110 transition-all duration-700" alt="Camp" />
                </div>
              )) : (
                <div className="col-span-2 h-64 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 font-bold uppercase text-xs">Gallery Empty</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- TRAINEE DIRECTORY --- */}
      <section id="directory" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">Directory</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Verified Trainee Enrollment List</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="SEARCH BY NAME..."
                className="w-full pl-16 pr-6 py-5 bg-white rounded-2xl shadow-sm outline-none border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-amber-400 text-xs font-black uppercase tracking-widest transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em]">Trainee Name</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em]">Discipline</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em]">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {displayedAthletes.map((a: any, i: number) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={a.id || i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6">
                          <p className="font-black text-slate-900 uppercase text-sm">{a.firstName} {a.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Age: {a.age || '—'}</p>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase">
                            {a.sport}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-slate-500 text-[11px] font-bold uppercase">
                            <div className="flex items-center gap-2"><MapPin size={12} className="text-slate-300"/> {a.homeAddress || 'Private'}</div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {visibleCount < filteredAthletes.length && (
              <div className="p-8 bg-slate-50 text-center border-t border-slate-100">
                <button 
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="px-12 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase hover:border-amber-400 transition-all shadow-sm"
                >
                  Load More Profiles
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white flex flex-col items-center">
        <Link to="/login" className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-amber-500 transition-colors uppercase tracking-[0.3em]">
          <LogIn size={14} /> Security Login
        </Link>
      </footer>

      <Footer />
    </div>
  );
}