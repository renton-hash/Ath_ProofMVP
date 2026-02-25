import { useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Download,
  ChevronRight,
  Trophy,
  Users,
  Star,
  Loader2,
  ArrowRight,
  School,
  Medal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSite } from '../context/SiteContext';

const sportsList = [
  { name: 'Tennis', emoji: '🎾', color: 'border-lime-400', theme: 'text-lime-600' },
  { name: 'Basketball', emoji: '🏀', color: 'border-orange-400', theme: 'text-orange-600' },
  { name: 'Volleyball', emoji: '🏐', color: 'border-purple-400', theme: 'text-purple-600' },
  { name: 'Baseball', emoji: '⚾', color: 'border-blue-400', theme: 'text-blue-600' },
  { name: 'Football', emoji: '⚽', color: 'border-green-400', theme: 'text-green-600' },
  { name: 'Badminton', emoji: '🏸', color: 'border-red-400', theme: 'text-red-600' }
];

const FLYER_URL = "/IfeYouth.jpg";

export function LandingPage() {
  const { athletes, loading } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSport, setFilterSport] = useState('All');

  // --- LOGIC: CALCULATE REAL-TIME STATS ---
  const stats = useMemo(() => {
    const list = athletes || [];
    // Calculate school distribution
    const schoolMap: Record<string, number> = {};
    list.forEach((a: { school: string | number; }) => {
      if (a.school) schoolMap[a.school] = (schoolMap[a.school] || 0) + 1;
    });

    const topSchools = Object.entries(schoolMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return {
      total: list.length,
      topSchools,
      sportsCounts: sportsList.reduce((acc, s) => {
        acc[s.name] = list.filter((a: { sport: string; }) => a.sport === s.name).length;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [athletes]);

  const filteredAthletes = (athletes || []).filter((a: any) => {
    const q = searchQuery.toLowerCase();
    const fullName = a.name || `${a.firstName || ''} ${a.lastName || ''}`;
    const matchQ = !q || fullName.toLowerCase().includes(q) || a.school?.toLowerCase().includes(q);
    const matchSport = filterSport === 'All' || a.sport === filterSport;
    return matchQ && matchSport;
  });

  const handleDownloadFlyer = () => {
    const link = document.createElement('a');
    link.href = FLYER_URL;
    link.download = 'IYSDC-2026-Flyer.jpg';
    link.click();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-navy">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={FLYER_URL} alt="IYSDC 2026" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl">
            
            {/* Live Registration Badge */}
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 pr-6 rounded-2xl mb-8">
              <div className="bg-gold p-3 rounded-xl shadow-lg shadow-gold/20">
                <Users className="text-navy" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-gold font-black uppercase tracking-widest">Verified Participants</p>
                <p className="text-2xl text-white font-black">{loading ? '...' : stats.total}</p>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6">
              IFE YOUTH <br /> <span className="text-gold">SPORTS</span> <br /> CAMP
            </h1>
            
            <p className="text-gray-300 text-lg mb-10 max-w-lg border-l-4 border-gold pl-6">
              Raising Champions, Inspiring Futures. Official athlete directory and tournament standings for IYSDC 2026.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-4 bg-gold text-navy font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-3">
                ADMIN PORTAL <ArrowRight size={20} />
              </Link>
              <button onClick={handleDownloadFlyer} className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2">
                <Download size={20} /> FLYER
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <CountdownTimer />

      {/* --- QUICK STATS & TOP SCHOOLS --- */}
      <section className="py-12 px-6 bg-navy text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h3 className="text-gold font-black text-2xl mb-2">TOP DELEGATIONS</h3>
            <p className="text-gray-400 text-sm">Schools with the highest registration volume.</p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.topSchools.map((school, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-gold/50 transition-colors">
                <School className="text-gold mb-3" size={24} />
                <p className="text-xs text-gray-400 font-bold uppercase truncate">{school.name}</p>
                <p className="text-2xl font-black">{school.count} <span className="text-sm font-normal text-gray-500">Athletes</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SPORTS GRID --- */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-black text-navy leading-none">THE GAMES</h2>
              <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-sm">Official Competition Disciplines</p>
            </div>
            <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border">
              <div className="text-center px-6 border-r">
                <p className="text-2xl font-black text-navy">{sportsList.length}</p>
                <p className="text-[10px] font-bold text-gray-400">SPORTS</p>
              </div>
              <div className="text-center px-6">
                <p className="text-2xl font-black text-gold">{loading ? '...' : stats.total}</p>
                <p className="text-[10px] font-bold text-gray-400">ATHLETES</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sportsList.map((sport) => (
              <div 
                key={sport.name} 
                onClick={() => setFilterSport(sport.name)}
                className={`group bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-gold shadow-sm hover:shadow-xl transition-all cursor-pointer text-center`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{sport.emoji}</div>
                <h4 className="font-bold text-navy mb-1">{sport.name}</h4>
                <p className="text-xs font-bold text-gray-400">{stats.sportsCounts[sport.name] || 0} ENROLLED</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LIVE ATHLETE DIRECTORY --- */}
      <section id="directory" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-4xl font-black flex items-center gap-3">
              <Search className="text-gold" size={32} /> ATHLETE DIRECTORY
            </h2>
            <div className="flex w-full md:w-auto gap-4">
              <input 
                type="text" 
                placeholder="Search name or school..."
                className="flex-1 md:w-80 px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-gold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy/5 border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Athlete</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Sport</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Institution</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAthletes.map((a: { name: any; firstName: any; lastName: any; sport: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; school: any; }, i: Key | null | undefined) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold/20 text-navy flex items-center justify-center font-black">
                          {(a.name || a.firstName || "A")[0]}
                        </div>
                        <span className="font-bold text-navy uppercase text-sm tracking-tight">{a.name || `${a.firstName} ${a.lastName}`}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-600">{a.sport}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">{a.school || 'Private Entry'}</td>
                    <td className="px-8 py-5 text-right">
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase">Verified</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredAthletes.length === 0 && !loading && (
              <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">No athletes found in directory</div>
            )}
          </div>
        </div>
      </section>

      {/* --- STANDINGS / MEDAL TABLE PREVIEW --- */}
      <section className="py-24 px-6 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Trophy size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Medal className="text-gold mx-auto mb-4" size={48} />
            <h2 className="text-5xl font-black text-white">TOURNAMENT STANDINGS</h2>
            <p className="text-gold font-bold tracking-[0.3em] mt-2">COMING SOON FEB 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Gold', 'Silver', 'Bronze'].map((m) => (
              <div key={m} className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem] text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                  m === 'Gold' ? 'bg-gold text-navy' : m === 'Silver' ? 'bg-gray-300 text-navy' : 'bg-orange-700 text-white'
                }`}>
                  <Trophy size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{m.toUpperCase()}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Final results will be published here in real-time by camp officials.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}