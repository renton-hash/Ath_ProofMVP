import  { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Video,
  Calendar,
  User,
  LogOut,
  Upload,
  ChevronRight,
  TrendingUp } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis } from
'recharts';
import { useSite } from '../context/SiteContext';
import { mockAthletes } from '../data/mockData';
const performanceHistory = [
{
  month: 'Oct',
  speed: 6,
  endurance: 5,
  technique: 7
},
{
  month: 'Nov',
  speed: 7,
  endurance: 6,
  technique: 7
},
{
  month: 'Dec',
  speed: 7,
  endurance: 7,
  technique: 8
},
{
  month: 'Jan',
  speed: 8,
  endurance: 7,
  technique: 8
},
{
  month: 'Feb',
  speed: 8,
  endurance: 8,
  technique: 9
}];

const myAthletes = mockAthletes.filter((a) => a.coachId === 'COA2026-001');
function CoachSidebar({
  active,
  setActive



}: {active: string;setActive: (s: string) => void;}) {
  const navigate = useNavigate();
  const { setCurrentUser } = useSite();
  const items = [
  {
    id: 'athletes',
    label: 'My Athletes',
    icon: <Users size={18} />
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <TrendingUp size={18} />
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: <Video size={18} />
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: <Calendar size={18} />
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: <User size={18} />
  }];

  return (
    <aside className="w-60 bg-navy min-h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gold p-1.5 rounded-lg">
            <Shield size={16} className="text-navy" />
          </div>
          <span className="font-heading text-base text-white">ATH-PROOF</span>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2">
          <p className="text-green-300 text-xs font-semibold">COACH</p>
          <p className="text-white text-xs font-id">COA2026-001</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-0.5">
        {items.map((item) =>
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active === item.id ? 'bg-gold text-navy' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>

            {item.icon} {item.label}
          </button>
        )}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            setCurrentUser(null);
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm rounded-lg hover:bg-white/10 transition-all">

          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>);

}
export function CoachDashboard() {
  const [activeTab, setActiveTab] = useState('athletes');
  const [selectedAthlete, setSelectedAthlete] = useState(myAthletes[0]);
  const [metrics, setMetrics] = useState({
    speed: 8,
    endurance: 7,
    strength: 8,
    technique: 9,
    teamwork: 8
  });
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [uploadedVideos] = useState([
  {
    title: 'Football Training Session',
    athlete: 'Adebayo Okonkwo',
    date: '2026-02-20',
    type: 'Training'
  },
  {
    title: 'Match Highlights vs Ife North',
    athlete: 'Oluwaseun Adeleke',
    date: '2026-02-18',
    type: 'Competition'
  },
  {
    title: 'Fitness Drill Recording',
    athlete: 'Blessing Okafor',
    date: '2026-02-15',
    type: 'Training'
  }]
  );
  const radarData = [
  {
    subject: 'Speed',
    value: metrics.speed
  },
  {
    subject: 'Endurance',
    value: metrics.endurance
  },
  {
    subject: 'Strength',
    value: metrics.strength
  },
  {
    subject: 'Technique',
    value: metrics.technique
  },
  {
    subject: 'Teamwork',
    value: metrics.teamwork
  }];

  const handleSaveMetrics = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CoachSidebar active={activeTab} setActive={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="font-heading text-2xl text-navy">COACH DASHBOARD</h1>
            <p className="text-gray-400 text-xs">ATH-PROOF • IYSDC 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-navy">
                Coach Adewale Ogundimu
              </p>
              <p className="text-xs font-id text-gray-400">
                COA2026-001 • Football
              </p>
            </div>
            <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AO
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'athletes' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="space-y-4">

              <div className="grid grid-cols-3 gap-4 mb-2">
                {[
              {
                label: 'My Athletes',
                value: myAthletes.length
              },
              {
                label: 'Active',
                value: myAthletes.filter((a) => a.status === 'Active').
                length
              },
              {
                label: 'Sports',
                value: [...new Set(myAthletes.map((a) => a.sport))].length
              }].
              map((s) =>
              <div
                key={s.label}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">

                    <p className="font-heading text-3xl text-navy">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
              )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myAthletes.map((athlete) =>
              <motion.div
                key={athlete.id}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-gold transition-all cursor-pointer"
                onClick={() => {
                  setSelectedAthlete(athlete);
                  setActiveTab('performance');
                }}>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-gold font-heading text-lg">
                        {athlete.firstName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {athlete.firstName} {athlete.lastName}
                        </p>
                        <p className="text-xs font-id text-gray-400">
                          {athlete.id}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                      <span>🏅 {athlete.sport}</span>
                      <span>🎂 Age {athlete.age}</span>
                      <span>
                        🏫 {athlete.school.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <span>📍 {athlete.lga}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${athlete.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>

                        {athlete.status}
                      </span>
                      <span className="text-gold text-xs font-semibold flex items-center gap-1">
                        View Performance <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
              )}
              </div>
            </motion.div>
          }

          {activeTab === 'performance' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="space-y-5">

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-5">
                  <label className="text-sm font-semibold text-gray-600">
                    Select Athlete:
                  </label>
                  <select
                  value={selectedAthlete.id}
                  onChange={(e) =>
                  setSelectedAthlete(
                    myAthletes.find((a) => a.id === e.target.value) ||
                    myAthletes[0]
                  )
                  }
                  className="input-field text-sm max-w-xs">

                    {myAthletes.map((a) =>
                  <option key={a.id} value={a.id}>
                        {a.firstName} {a.lastName} ({a.id})
                      </option>
                  )}
                  </select>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-navy mb-4">
                      Update Performance Metrics
                    </h3>
                    <div className="space-y-3">
                      {(
                    [
                    'speed',
                    'endurance',
                    'strength',
                    'technique',
                    'teamwork'] as
                    const).
                    map((metric) =>
                    <div key={metric} className="flex items-center gap-3">
                          <label className="text-sm font-medium text-gray-600 w-24 capitalize">
                            {metric}
                          </label>
                          <input
                        type="range"
                        min="1"
                        max="10"
                        value={metrics[metric]}
                        onChange={(e) =>
                        setMetrics((p) => ({
                          ...p,
                          [metric]: parseInt(e.target.value)
                        }))
                        }
                        className="flex-1 accent-gold" />

                          <span className="text-sm font-bold text-navy w-6 text-center">
                            {metrics[metric]}
                          </span>
                        </div>
                    )}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Training Notes
                      </label>
                      <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="input-field resize-none text-sm"
                      placeholder="Add training notes, observations, recommendations..." />

                    </div>
                    <button
                    onClick={handleSaveMetrics}
                    className={`mt-3 w-full py-2.5 font-bold rounded-xl transition-all text-sm ${saved ? 'bg-green-500 text-white' : 'bg-navy text-white hover:bg-navy-light'}`}>

                      {saved ? '✓ Metrics Saved!' : 'Save Performance Update'}
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-4">
                      Performance Radar
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fontSize: 11
                        }} />

                        <PolarRadiusAxis
                        angle={30}
                        domain={[0, 10]}
                        tick={{
                          fontSize: 9
                        }} />

                        <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="#C9A84C"
                        fill="#C9A84C"
                        fillOpacity={0.3} />

                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-navy mb-4">
                  Performance Trend — {selectedAthlete.firstName}{' '}
                  {selectedAthlete.lastName}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11
                    }} />

                    <YAxis
                    domain={[0, 10]}
                    tick={{
                      fontSize: 11
                    }} />

                    <Tooltip />
                    <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    dot={{
                      r: 3
                    }}
                    name="Speed" />

                    <Line
                    type="monotone"
                    dataKey="endurance"
                    stroke="#0A1628"
                    strokeWidth={2}
                    dot={{
                      r: 3
                    }}
                    name="Endurance" />

                    <Line
                    type="monotone"
                    dataKey="technique"
                    stroke="#16A34A"
                    strokeWidth={2}
                    dot={{
                      r: 3
                    }}
                    name="Technique" />

                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          }

          {activeTab === 'videos' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="space-y-4">

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-navy mb-4">
                  Upload Training Video
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                  className="input-field text-sm"
                  placeholder="Video title" />

                  <select className="input-field text-sm">
                    <option>Select athlete</option>
                    {myAthletes.map((a) =>
                  <option key={a.id}>
                        {a.firstName} {a.lastName}
                      </option>
                  )}
                  </select>
                  <select className="input-field text-sm">
                    <option>Training</option>
                    <option>Competition</option>
                    <option>Analysis</option>
                  </select>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-gold transition-colors text-sm text-gray-500">
                    <Upload size={16} /> Choose video file
                    <input type="file" className="hidden" accept="video/*" />
                  </label>
                </div>
                <button className="mt-4 px-6 py-2.5 bg-navy text-white font-bold rounded-xl hover:bg-navy-light transition-all text-sm">
                  Upload Video
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-navy">
                    Uploaded Videos ({uploadedVideos.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {uploadedVideos.map((v, i) =>
                <div key={i} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center text-2xl">
                        🎬
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {v.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {v.athlete} • {v.date}
                        </p>
                      </div>
                      <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v.type === 'Competition' ? 'bg-gold/20 text-gold-dark' : 'bg-navy/10 text-navy'}`}>

                        {v.type}
                      </span>
                    </div>
                )}
                </div>
              </div>
            </motion.div>
          }

          {activeTab === 'schedule' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-navy">
                    IYSDC 2026 — Football Schedule
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                {
                  date: 'Feb 25, 2026',
                  time: '10:00 AM',
                  event: 'Football U-18 Opening Match',
                  venue: 'Field A',
                  category: 'U-18'
                },
                {
                  date: 'Feb 25, 2026',
                  time: '02:00 PM',
                  event: 'Football U-21 Group Stage',
                  venue: 'Field A',
                  category: 'U-21'
                },
                {
                  date: 'Feb 27, 2026',
                  time: '09:00 AM',
                  event: 'Football U-21 Semi-Finals',
                  venue: 'Field A',
                  category: 'U-21'
                },
                {
                  date: 'Feb 28, 2026',
                  time: '10:00 AM',
                  event: 'Football Finals',
                  venue: 'Main Arena',
                  category: 'All'
                }].
                map((s, i) =>
                <div key={i} className="px-5 py-4 flex items-center gap-4">
                      <div className="text-2xl">⚽</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {s.event}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.date} • {s.time} • {s.venue}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-navy/10 text-navy text-xs font-semibold rounded-full">
                        {s.category}
                      </span>
                    </div>
                )}
                </div>
              </div>
            </motion.div>
          }

          {activeTab === 'profile' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="max-w-2xl">

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-navy p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-navy font-heading text-2xl">
                    AO
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl text-white">
                      COACH ADEWALE OGUNDIMU
                    </h2>
                    <p className="text-gold text-sm font-id">COA2026-001</p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                {
                  label: 'Full Name',
                  value: 'Adewale Ogundimu'
                },
                {
                  label: 'Coach ID',
                  value: 'COA2026-001'
                },
                {
                  label: 'Sport Specialty',
                  value: 'Football'
                },
                {
                  label: 'Qualification',
                  value: 'UEFA B License'
                },
                {
                  label: 'Email',
                  value: 'adewale.ogundimu@iysdi.org'
                },
                {
                  label: 'Phone',
                  value: '+234 803 111 2222'
                },
                {
                  label: 'LGA',
                  value: 'Ife Central'
                },
                {
                  label: 'State',
                  value: 'Osun'
                },
                {
                  label: 'Athletes Assigned',
                  value: `${myAthletes.length}`
                },
                {
                  label: 'Registered By',
                  value: 'ADM2026-001'
                }].
                map((item) =>
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-0.5">
                        {item.label}
                      </p>
                      <p
                    className={`text-sm font-semibold text-navy ${item.label.includes('ID') ? 'font-id' : ''}`}>

                        {item.value}
                      </p>
                    </div>
                )}
                </div>
              </div>
            </motion.div>
          }
        </div>
      </main>
    </div>);

}