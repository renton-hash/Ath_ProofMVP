import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Database, CheckCircle, AlertCircle, 
  Loader2, Trash2, Download, ArrowUpDown, 
  Search, MapPin, School, Users, Phone
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';

export function AdminDashboard() {
  const { athletes } = useSite();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    homeAddress: '',
    parentPhone: '', 
    sport: 'Football',
    age: '11',
    gender: 'Male' 
  });

  // --- LOGIC: CSV EXPORT WITH FULL INFO ---
  const downloadCSV = () => {
    const headers = ["First Name", "Middle Name", "Last Name", "Sport", "Age", "Gender", "Parent Phone", "Address", "Date"];
    const rows = filteredAthletes.map(a => [
      a.firstName, a.middleName || '', a.lastName, a.sport, a.age, a.gender, a.parentPhone || 'N/A', `"${a.homeAddress || 'N/A'}"`,
      a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `IYSDC_Athletes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // --- LOGIC: FILTER & SORT ---
  const filteredAthletes = useMemo(() => {
    let items = athletes ? [...athletes] : [];
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      items = items.filter(a => 
        a.firstName?.toLowerCase().includes(query) || 
        a.lastName?.toLowerCase().includes(query) ||
        a.middleName?.toLowerCase().includes(query) ||
        a.parentPhone?.includes(query) ||
        a.homeAddress?.toLowerCase().includes(query)
      );
    }
    if (sortConfig) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [athletes, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // --- LOGIC: SUBMIT REGISTRATION ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'athletes'), {
        ...formData,
        // Ensure middle name is included in the searchable name string
        name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
        registeredBy: 'Admin',
        createdAt: serverTimestamp(),
        verified: true
      });
      setStatus({ type: 'success', msg: 'Sync Successful' });
      setFormData({ 
        firstName: '', middleName:'', lastName: '', 
        homeAddress: '', parentPhone: '', 
        sport: 'Football', age: '11', gender: 'Male' 
      });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Connection Error' });
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    setIsDeleting(id);
    try { await deleteDoc(doc(db, 'athletes', id)); } catch (e) { alert("Permission Denied"); } 
    finally { setIsDeleting(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 md:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">System Admin v2.1</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase italic">
              Registry <span className="text-slate-300">Command</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified</p>
                <p className="text-2xl font-black text-[#0F172A]">{athletes?.length || 0}</p>
              </div>
              <div className="h-8 w-[1px] bg-slate-100" />
              <button onClick={downloadCSV} className="p-3 bg-[#0F172A] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-navy/20 flex items-center gap-2">
                <Download size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* FORM PANEL */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sticky top-28">
               <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-amber-400/10 rounded-2xl flex items-center justify-center">
                  <UserPlus size={20} className="text-amber-500" />
                </div>
                <h2 className="font-black text-[#0F172A] text-sm uppercase tracking-widest">Athlete Entry</h2>
               </div>

               <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First Name" value={formData.firstName} onChange={(v: any) => setFormData({...formData, firstName: v})} />
                    <Field label="Middle Name" value={formData.middleName} onChange={(v: any) => setFormData({...formData, middleName: v})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Last Name" value={formData.lastName} onChange={(v: any) => setFormData({...formData, lastName: v})} />
                    <Field label="Phone" type="tel" value={formData.parentPhone} onChange={(v: any) => setFormData({...formData, parentPhone: v})} />
                  </div>
                  
                  <Field label="Home Address" value={formData.homeAddress} onChange={(v: any) => setFormData({...formData, homeAddress: v})} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Gender" options={['Male', 'Female']} value={formData.gender} onChange={(v: any) => setFormData({...formData, gender: v})} />
                    <Select label="Age" options={['11', '12', '13','14', '15', '16', '17', '18','19', '20']} value={formData.age} onChange={(v: any) => setFormData({...formData, age: v})} />
                  </div>
                  <Select label="Sport" options={['Football', 'Basketball', 'Volleyball', 'Table Tennis', 'Scrabbles']} value={formData.sport} onChange={(v: any) => setFormData({...formData, sport: v})} />

                  <button disabled={isSubmitting} className="w-full py-4 bg-[#0F172A] text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-navy/30 transition-all text-[11px] tracking-[0.2em] uppercase mt-2">
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Registration'}
                  </button>
               </form>
            </div>
          </aside>

          {/* TABLE PANEL */}
          <main className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                placeholder="SEARCH NAME, ADDRESS, OR PHONE..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[2rem] border border-slate-200 outline-none text-xs font-black tracking-widest text-[#0F172A] focus:ring-4 focus:ring-amber-500/5 transition-all uppercase" 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <SortHeader label="Athlete / Contact" k="firstName" current={sortConfig} onSort={requestSort} />
                      <SortHeader label="Sport/Age" k="sport" current={sortConfig} onSort={requestSort} />
                      <SortHeader label="Full Address" k="homeAddress" current={sortConfig} onSort={requestSort} />
                      <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAthletes.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                          <p className="font-black text-[#0F172A] text-xs uppercase tracking-tight">
                            {a.firstName} {a.middleName} {a.lastName}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <Phone size={10} /> {a.parentPhone || 'No Phone'}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black px-2 py-1 bg-[#0F172A] text-white rounded uppercase">{a.sport}</span>
                                <span className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">{a.gender}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{a.age} YEARS OLD</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-[10px] font-bold text-slate-500 uppercase max-w-[200px] leading-relaxed">
                            {a.homeAddress}
                           </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => handleDelete(a.id, `${a.firstName} ${a.lastName}`)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                            {isDeleting === a.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE ADAPTIVE VIEW */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredAthletes.map((a: any) => (
                  <div key={a.id} className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-black text-[#0F172A] text-sm uppercase tracking-tight">
                                {a.firstName} {a.middleName} {a.lastName}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-bold">{a.parentPhone}</p>
                        </div>
                        <button onClick={() => handleDelete(a.id, a.firstName)} className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Address</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase">{a.homeAddress}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[9px] font-black px-2 py-0.5 bg-navy/5 text-[#0F172A] rounded uppercase">{a.sport}</span>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-amber-400/10 text-amber-600 rounded uppercase">{a.age} YRS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// UI HELPERS
const Field = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <input 
      type={type}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-xs font-bold text-[#0F172A] focus:border-amber-500/50 transition-all uppercase" 
    />
  </div>
);

const Select = ({ label, options, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-black text-[#0F172A] uppercase">
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const SortHeader = ({ label, k, current, onSort }: any) => (
  <th onClick={() => onSort(k)} className="px-8 py-6 cursor-pointer hover:bg-slate-100 transition-colors">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label} <ArrowUpDown size={12} className={current?.key === k ? 'text-amber-500' : 'text-slate-200'} />
    </div>
  </th>
);