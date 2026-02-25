import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Database, CheckCircle, AlertCircle, 
  Loader2, Trash2, Download, ArrowUpDown, 
  Search, MapPin, School, Users, Phone, FileText
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';

// --- FIXED PDF EXPORT IMPORTS ---
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 

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

  // --- EXPORT: CSV ---
  const downloadCSV = () => {
    const headers = ["First Name", "Middle Name", "Last Name", "Sport", "Age", "Gender", "Phone", "Address", "Registration Date"];
    const rows = (filteredAthletes || []).map(a => [
      a.firstName || '', 
      a.middleName || '', 
      a.lastName || '', 
      a.sport || '', 
      a.age || '', 
      a.gender || '', 
      a.parentPhone || 'N/A', 
      `"${a.homeAddress || 'N/A'}"`,
      a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `IYSDC_Athletes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // --- EXPORT: PDF ---
  const downloadPDF = () => {
    try {
      const doc = new jsPDF('landscape'); 
      const tableColumn = ["Full Name", "Sport", "Age", "Gender", "Phone", "Home Address", "Reg. Date"];
      const tableRows = (filteredAthletes || []).map(a => [
        `${a.firstName} ${a.middleName ? a.middleName + ' ' : ''}${a.lastName}`,
        a.sport, a.age, a.gender, a.parentPhone || 'N/A', a.homeAddress || 'N/A',
        a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'N/A'
      ]);

      doc.setFontSize(18);
      doc.text("IYSDC ATHLETE REGISTRY REPORT", 14, 15);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], fontSize: 9 },
        styles: { fontSize: 8 }
      });

      doc.save(`Athlete_Registry_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  };

  const filteredAthletes = useMemo(() => {
    let items = athletes ? [...athletes] : [];
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      items = items.filter(a => 
        a.firstName?.toLowerCase().includes(query) || 
        a.lastName?.toLowerCase().includes(query) ||
        a.parentPhone?.includes(query)
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'athletes'), {
        ...formData,
        name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
        registeredBy: 'Admin',
        createdAt: serverTimestamp(),
        verified: true
      });
      setFormData({ 
        firstName: '', middleName:'', lastName: '', 
        homeAddress: '', parentPhone: '', 
        sport: 'Football', age: '11', gender: 'Male' 
      });
    } catch (err) {
      console.error(err);
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    setIsDeleting(id);
    try { await deleteDoc(doc(db, 'athletes', id)); } catch (e) { alert("Error deleting"); } 
    finally { setIsDeleting(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 md:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">System Admin v2.2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase italic">
              Registry <span className="text-slate-300">Command</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-3 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="text-center px-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-[#0F172A]">{athletes?.length || 0}</p>
              </div>
              <div className="h-8 w-[1px] bg-slate-100" />
              <div className="flex gap-2">
                <button onClick={downloadCSV} className="p-3 bg-slate-100 rounded-2xl flex items-center gap-2">
                  <Download size={18} />
                </button>
                <button onClick={downloadPDF} className="p-3 bg-[#0F172A] text-white rounded-2xl flex items-center gap-2">
                  <FileText size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* FORM ASIDE */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 sticky top-28">
               <h2 className="font-black text-[#0F172A] text-sm uppercase tracking-widest mb-8 flex items-center gap-3">
                  <UserPlus className="text-amber-500" size={18} /> Athlete Entry
               </h2>

               <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First Name" required value={formData.firstName} onChange={(v: string) => setFormData({...formData, firstName: v})} />
                    <Field label="Middle Name" required={false} value={formData.middleName} onChange={(v: string) => setFormData({...formData, middleName: v})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Last Name" required value={formData.lastName} onChange={(v: string) => setFormData({...formData, lastName: v})} />
                    <Field label="Phone" type="tel" required value={formData.parentPhone} onChange={(v: string) => setFormData({...formData, parentPhone: v})} />
                  </div>
                  <Field label="Home Address" required value={formData.homeAddress} onChange={(v: string) => setFormData({...formData, homeAddress: v})} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Gender" options={['Male', 'Female']} value={formData.gender} onChange={(v: string) => setFormData({...formData, gender: v})} />
                    <Select label="Age" options={['11', '12', '13','14', '15', '16', '17', '18','19', '20']} value={formData.age} onChange={(v: string) => setFormData({...formData, age: v})} />
                  </div>
                  <Select label="Sport" options={['Football', 'Basketball', 'Badminton', 'Volleyball', 'Table Tennis', 'Scrabbles']} value={formData.sport} onChange={(v: string) => setFormData({...formData, sport: v})} />

                  <button disabled={isSubmitting} className="w-full py-4 bg-[#0F172A] text-white font-black rounded-2xl uppercase mt-2">
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Registration'}
                  </button>
               </form>
            </div>
          </aside>

          {/* MAIN LIST AREA */}
          <main className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                placeholder="SEARCH RECORDS..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[2rem] border border-slate-200 outline-none text-xs font-black tracking-widest uppercase" 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>

            {/* MOBILE VIEW (CARDS) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredAthletes.map((a: any) => (
                <div key={a.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-[#0F172A] text-sm uppercase">{a.firstName} {a.lastName}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">{a.parentPhone}</p>
                    </div>
                    <span className="text-[9px] font-black px-2 py-1 bg-[#0F172A] text-white rounded uppercase">{a.sport}</span>
                  </div>
                  <div className="border-t pt-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <MapPin size={12} /> {a.homeAddress || 'No Address'}
                    </p>
                    <p className="text-[9px] font-black text-slate-400">AGE: {a.age} | GENDER: {a.gender}</p>
                  </div>
                  <button onClick={() => handleDelete(a.id, a.firstName)} className="absolute bottom-6 right-6 text-slate-300 hover:text-rose-500">
                    {isDeleting === a.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  </button>
                </div>
              ))}
            </div>
            
            {/* DESKTOP VIEW (TABLE) */}
            <div className="hidden md:block bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <SortHeader label="Athlete" k="firstName" current={sortConfig} onSort={requestSort} />
                      <SortHeader label="Sport" k="sport" current={sortConfig} onSort={requestSort} />
                      <SortHeader label="Address" k="homeAddress" current={sortConfig} onSort={requestSort} />
                      <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAthletes.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-8 py-6">
                          <p className="font-black text-[#0F172A] text-xs uppercase">{a.firstName} {a.middleName} {a.lastName}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">{a.parentPhone}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[9px] font-black px-2 py-1 bg-[#0F172A] text-white rounded uppercase">{a.sport}</span>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-[10px] font-bold text-slate-500 uppercase max-w-[150px] truncate">{a.homeAddress}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => handleDelete(a.id, a.firstName)} className="p-3 text-slate-200 hover:text-rose-500">
                            {isDeleting === a.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
}

const Field = ({ label, value, onChange, type = "text", required = true }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <input 
      required={required}
      type={type}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-xs font-bold text-[#0F172A] transition-all uppercase" 
    />
  </div>
);

const Select = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-black text-[#0F172A] uppercase"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const SortHeader = ({ label, k, current, onSort }: { label: string, k: string, current: any, onSort: (k: string) => void }) => (
  <th onClick={() => onSort(k)} className="px-8 py-6 cursor-pointer">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label} <ArrowUpDown size={12} className={current?.key === k ? 'text-amber-500' : 'text-slate-200'} />
    </div>
  </th>
);