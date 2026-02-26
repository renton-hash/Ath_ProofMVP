import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  ArrowRight,
  MapPin,
  ChevronRight,
  Filter,
  Lock,
  Newspaper,
  Image as ImageIcon,
  LogIn // New icon for the bottom login
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSite } from '../context/SiteContext';

// Clean list focused on training disciplines
const sportsList = [
  { name: 'Football', emoji: '⚽', desc: 'Technical drills & match play.' },
  { name: 'Basketball', emoji: '🏀', desc: 'Foundational hoops training.' },
  { name: 'Volleyball', emoji: '🏐', desc: 'Skill-based serve & volley.' },
  { name: 'Scrabbles', emoji: '🔠', desc: 'Cognitive strategy sessions.' },
  { name: 'Table Tennis', emoji: '🏓', desc: 'Reflex and agility training.' }
];

const blogPosts = [
  {
    title: "Preparing for IYSDC 2026: Tips for Young Athletes",
    excerpt: "Success starts before you step onto the field. Learn how to mentally and physically prepare...",
    date: "Oct 12, 2025",
    category: "Training",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80"
  },
  {
    title: "The Importance of Teamwork in Youth Sports",
    excerpt: "Individual talent wins games, but teamwork and intelligence win championships...",
    date: "Sept 28, 2025",
    category: "Mentorship",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80"
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80"
];

const FLYER_URL = "/IfeYouth.jpg";
const ITEMS_PER_PAGE = 10;

export function LandingPage() {
  const { athletes, loading } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

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
      const fullName = `${a.firstName || ''} ${a.middleName || ''} ${a.lastName || ''}`.toLowerCase();
      const matchSearch = !q || 
        fullName.includes(q) || 
        a.homeAddress?.toLowerCase().includes(q) || 
        a.parentPhone?.includes(q);
      const matchSport = filterSport === 'All' || a.sport === filterSport;
      return matchSearch && matchSport;
    });
  }, [athletes, searchQuery, filterSport]);

  const displayedAthletes = filteredAthletes.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      {/* --- HERO SECTION (Login removed) --- */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={FLYER_URL} alt="IYSDC 2026" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0F172A]/85 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              TRAIN <br /><span className="text-amber-400">HARDER.</span>
            </h1>
            <p className="text-slate-300 text-xl mb-12 max-w-xl leading-relaxed">
              Ife Youth Sports Camp 2026. A dedicated environment for youth athletes to master their craft under professional mentorship.
            </p>
            <a href="#directory" className="inline-flex px-12 py-5 bg-amber-400 text-[#0F172A] font-black rounded-2xl hover:bg-amber-300 transition-all gap-3 items-center">
              VIEW TRAINEE DIRECTORY <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      <CountdownTimer />

      {/* --- TRAINING DISCIPLINES --- */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Training Tracks</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-3 italic">Professional coaching in {sportsList.length} specialized areas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {sportsList.map((sport) => (
              <motion.div 
                key={sport.name}
                whileHover={{ y: -8 }}
                onClick={() => {
                  setFilterSport(sport.name);
                  document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer text-center ${
                  filterSport === sport.name ? 'bg-amber-400 border-amber-500 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="text-5xl mb-4">{sport.emoji}</div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{sport.name.toUpperCase()}</h3>
                <div className={`text-2xl font-black mb-1 ${filterSport === sport.name ? 'text-white' : 'text-amber-500'}`}>
                  {stats.sportsCounts[sport.name] || 0}
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Enrolled</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTENT HUB --- */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-12">
             <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4 uppercase">
              <Newspaper className="text-amber-500" /> Training News
            </h2>
            {blogPosts.map((post, i) => (
              <div key={i} className="group cursor-pointer flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden shrink-0 shadow-lg border border-slate-100">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={post.title} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-500 uppercase">{post.category}</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3 group-hover:text-amber-500 transition-colors uppercase leading-tight">{post.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 space-y-12">
            <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4 uppercase">
              <ImageIcon className="text-slate-900" /> Camp Life
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className={`rounded-[2rem] overflow-hidden h-40 shadow-md ${i === 0 ? 'col-span-2 h-64' : ''}`}>
                  <img src={img} className="w-full h-full object-cover hover:scale-105 transition-all" alt="Training Session" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- DIRECTORY --- */}
      <section id="directory" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-4 block">Verified Enrollment List</span>
              <h2 className="text-6xl font-black text-slate-900 tracking-tight">DIRECTORY</h2>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search trainees..."
                className="w-full pl-16 pr-6 py-5 bg-white rounded-2xl shadow-sm outline-none border-none focus:ring-2 focus:ring-amber-400 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0F172A] text-white">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Trainee</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Sport</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Home Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {displayedAthletes.map((a: any, i: number) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={a.id || i} className="hover:bg-slate-50">
                        <td className="px-8 py-6">
                          <p className="font-black text-slate-900 uppercase text-sm">{a.firstName} {a.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">AGE: {a.age || '—'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-tighter">
                            {a.sport}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase truncate max-w-[200px]">
                            <MapPin size={12} className="text-amber-500 shrink-0" /> {a.homeAddress || 'Private'}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {visibleCount < filteredAthletes.length && (
              <div className="p-8 bg-slate-50 text-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="px-10 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase hover:shadow-lg transition-all"
                >
                  Load More Profiles
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- DISCREET ADMIN FOOTER --- */}
      <section className="py-12 border-t border-slate-100 flex flex-col items-center bg-white">
        <Link to="/login" className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-amber-500 transition-colors uppercase tracking-[0.3em]">
          <LogIn size={14} /> Admin Access Only
        </Link>
      </section>

      <Footer />
    </div>
  );
}