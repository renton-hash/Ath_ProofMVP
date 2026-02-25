import  { useState, createElement } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Filter,
  Download,
  LogOut,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown } from
'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { mockAthletes } from '../data/mockData';
function ScoutSidebar({
  active,
  setActive



}: {active: string;setActive: (s: string) => void;}) {
  const navigate = useNavigate();
  const { setCurrentUser } = useSite();
  const items = [
  {
    id: 'search',
    label: 'Search Athletes',
    icon: <Search size={18} />
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
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-2">
          <p className="text-purple-300 text-xs font-semibold">
            OFFICIAL / SCOUT
          </p>
          <p className="text-white text-xs font-id">OFF2026-002</p>
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
export function ScoutDashboard() {
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('');
  const [filterSport, setFilterSport] = useState('All');
  const [filterLGA, setFilterLGA] = useState('All');
  const [filterAge, setFilterAge] = useState('');
  const [sortCol, setSortCol] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const filtered = mockAthletes.filter((a) => {
    const q = query.toLowerCase();
    return (
      (!q ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.school.toLowerCase().includes(q)) && (
      filterSport === 'All' || a.sport === filterSport) && (
      filterLGA === 'All' || a.lga === filterLGA) && (
      !filterAge || a.age === parseInt(filterAge)));

  });
  const sorted = [...filtered].sort((a, b) => {
    const va = (a as any)[sortCol];
    const vb = (b as any)[sortCol];
    return sortAsc ? va > vb ? 1 : -1 : va < vb ? 1 : -1;
  });
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);
  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);else
    {
      setSortCol(col);
      setSortAsc(true);
    }
  };
  const exportCSV = () => {
    const rows = [
    ['ID', 'Name', 'Age', 'Sport', 'School', 'LGA', 'State', 'Status'],
    ...filtered.map((a) => [
    a.id,
    `${a.firstName} ${a.lastName}`,
    a.age,
    a.sport,
    a.school,
    a.lga,
    a.state,
    a.status]
    )];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'athlete-report.csv';
    link.click();
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ScoutSidebar active={activeTab} setActive={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="font-heading text-2xl text-navy">
              SCOUT / OFFICIAL DASHBOARD
            </h1>
            <p className="text-gray-400 text-xs">
              ATH-PROOF • Read-Only Access
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-navy">Scout Grace Okonkwo</p>
              <p className="text-xs font-id text-gray-400">OFF2026-002</p>
            </div>
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              GO
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'search' &&
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

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative md:col-span-2">
                    <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15} />

                    <input
                    type="text"
                    placeholder="Search athletes by name or school..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    className="input-field pl-9 text-sm" />

                  </div>
                  <select
                  value={filterSport}
                  onChange={(e) => {
                    setFilterSport(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-sm">

                    <option value="All">All Sports</option>
                    {[
                  'Football',
                  'Basketball',
                  'Volleyball',
                  'Tennis',
                  'Badminton',
                  'Baseball'].
                  map((s) =>
                  <option key={s}>{s}</option>
                  )}
                  </select>
                  <select
                  value={filterLGA}
                  onChange={(e) => {
                    setFilterLGA(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-sm">

                    <option value="All">All LGAs</option>
                    {[
                  'Ife Central',
                  'Ife North',
                  'Ife East',
                  'Ife South',
                  'Ilesa East',
                  'Atakumosa West',
                  'Ejigbo',
                  'Ede North',
                  'Osogbo'].
                  map((l) =>
                  <option key={l}>{l}</option>
                  )}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600">
                      {filtered.length} athletes
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                      Read-Only
                    </span>
                  </div>
                  <button
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-dark">

                    <Download size={14} /> Export Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-navy text-white">
                      <tr>
                        {[
                      {
                        label: 'Athlete ID',
                        col: 'id'
                      },
                      {
                        label: 'Name',
                        col: 'firstName'
                      },
                      {
                        label: 'Age',
                        col: 'age'
                      },
                      {
                        label: 'Sport',
                        col: 'sport'
                      },
                      {
                        label: 'School',
                        col: 'school'
                      },
                      {
                        label: 'LGA',
                        col: 'lga'
                      },
                      {
                        label: 'Status',
                        col: 'status'
                      },
                      {
                        label: 'Profile',
                        col: ''
                      }].
                      map((h) =>
                      <th
                        key={h.label}
                        onClick={() => h.col && handleSort(h.col)}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${h.col ? 'cursor-pointer hover:bg-navy-light' : ''}`}>

                            <div className="flex items-center gap-1">
                              {h.label}
                              {h.col &&
                          <ArrowUpDown
                            size={11}
                            className={`opacity-40 ${sortCol === h.col ? 'opacity-100 text-gold' : ''}`} />

                          }
                            </div>
                          </th>
                      )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginated.map((a, i) =>
                    <motion.tr
                      key={a.id}
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        delay: i * 0.02
                      }}
                      className="hover:bg-gold/5 transition-colors">

                          <td className="px-4 py-3 text-xs font-id font-bold text-navy">
                            {a.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-navy text-gold flex items-center justify-center text-xs font-bold">
                                {a.firstName[0]}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {a.firstName} {a.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {a.age}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {a.sport}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {a.school}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {a.lga}
                          </td>
                          <td className="px-4 py-3">
                            <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>

                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                          to={`/athlete/${a.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-gold transition-colors">

                              <Eye size={12} /> View
                            </Link>
                          </td>
                        </motion.tr>
                    )}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Showing {(page - 1) * perPage + 1}–
                    {Math.min(page * perPage, filtered.length)} of{' '}
                    {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">

                      <ChevronLeft size={14} />
                    </button>
                    {Array.from(
                    {
                      length: totalPages
                    },
                    (_, i) => i + 1
                  ).map((p) =>
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs font-semibold ${page === p ? 'bg-navy text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>

                        {p}
                      </button>
                  )}
                    <button
                    onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">

                      <ChevronRight size={14} />
                    </button>
                  </div>
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
            className="max-w-xl">

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-navy p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-heading text-2xl">
                    GO
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl text-white">
                      SCOUT GRACE OKONKWO
                    </h2>
                    <p className="text-gold text-sm font-id">OFF2026-002</p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                {
                  label: 'Full Name',
                  value: 'Grace Okonkwo'
                },
                {
                  label: 'Official ID',
                  value: 'OFF2026-002'
                },
                {
                  label: 'Role',
                  value: 'Scout'
                },
                {
                  label: 'Email',
                  value: 'grace.okonkwo@iysdi.org'
                },
                {
                  label: 'LGA',
                  value: 'Ife North'
                },
                {
                  label: 'State',
                  value: 'Osun'
                },
                {
                  label: 'Access Level',
                  value: 'Read-Only'
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