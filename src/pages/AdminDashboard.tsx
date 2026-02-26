import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Loader2, Trash2, Download, ArrowUpDown, 
  Search, MapPin, Phone, FileText, Fingerprint, Calendar, Users, Database
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 


const Field = ({ label, value, onChange, type = "text", required = true }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      required={required}
      type={type}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-800 focus:border-amber-400 transition-all uppercase" 
    />
  </div>
);

const Select = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 uppercase outline-none focus:border-amber-400"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export function AdminDashboard() {
  const { athletes, addAthlete } = useSite();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // AGE UPDATE: Set initial age to '12' as a sensible default for 5-20 range
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    homeAddress: '', parentPhone: '', 
    sport: 'Football', age: '12', gender: 'Male' 
  });


  const downloadCSV = () => {
    const headers = ["Reg ID", "First Name", "Middle Name", "Last Name", "Gender", "Age", "Sport", "Phone", "Address"];
    const rows = (filteredAthletes || []).map(a => [
      a.athleteId || 'N/A',
      a.firstName || '', a.middleName || '', a.lastName || '', 
      a.gender || '', a.age || '', a.sport || '', 
      a.parentPhone || 'N/A', `"${a.homeAddress || 'N/A'}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `IYSDC_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF('landscape'); 
    const tableColumn = ["ID", "Full Name", "Sex", "Age", "Sport", "Phone", "Address"];
    const tableRows = (filteredAthletes || []).map(a => [
      a.athleteId || '',
      `${a.firstName} ${a.middleName ? a.middleName + ' ' : ''}${a.lastName}`,
      a.gender, a.age, a.sport, a.parentPhone, a.homeAddress
    ]);
    doc.setFontSize(16);
    doc.text("IYSDC ATHLETE REGISTRY - OFFICIAL REPORT", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] }
    });
    doc.save(`IYSDC_Registry_Report.pdf`);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const athleteId = `IYSDC-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;
      
      const success = await addAthlete({ 
        ...formData, 
        athleteId, 
        name: fullName, 
        timestamp: new Date() 
      });

      if (success) {
        // AGE UPDATE: Reset age back to '12' after success
        setFormData({ firstName: '', middleName: '', lastName: '', homeAddress: '', parentPhone: '', sport: 'Football', age: '12', gender: 'Male' });
        setStatus({ type: 'success', msg: `SAVED: ${athleteId}` });
      } else {
        setStatus({ type: 'error', msg: 'PERMISSION DENIED: CHECK ADMIN_USERS ROLE' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'SAVE FAILED' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const filteredAthletes = useMemo(() => {
    let items = athletes ? [...athletes] : [];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      items = items.filter(a => 
        a.firstName?.toLowerCase().includes(q) || 
        a.lastName?.toLowerCase().includes(q) || 
        a.athleteId?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [athletes, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
   
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Registry <span className="text-slate-300">Command</span></h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex-1 md:w-64">
                <Search className="text-slate-300" size={18} />
                <input placeholder="SEARCH DATABASE..." className="bg-transparent outline-none text-xs font-bold uppercase w-full" onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
             <button onClick={downloadCSV} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <Download size={18} />
             </button>
             <button onClick={downloadPDF} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-sm">
                <FileText size={18} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* FORM */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl sticky top-28">
              <h2 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <UserPlus size={18} className="text-amber-500" /> New Athlete Entry
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                {status && (
                  <div className={`p-4 rounded-xl text-[10px] font-black uppercase text-center border ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {status.msg}
                  </div>
                )}
                <Field label="First Name" value={formData.firstName} onChange={(v:any) => setFormData({...formData, firstName: v})} />
                <Field label="Middle Name (Optional)" required={false} value={formData.middleName} onChange={(v:any) => setFormData({...formData, middleName: v})} />
                <Field label="Last Name" value={formData.lastName} onChange={(v:any) => setFormData({...formData, lastName: v})} />
                
                <div className="grid grid-cols-2 gap-3">
                    <Select label="Gender" options={['Male', 'Female']} value={formData.gender} onChange={(v:any) => setFormData({...formData, gender: v})} />
                    {/* AGE UPDATE: Range from 5 to 20 */}
                    <Select 
                      label="Age" 
                      options={['5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']} 
                      value={formData.age} 
                      onChange={(v:any) => setFormData({...formData, age: v})} 
                    />
                </div>
                
                <Field label="Phone" value={formData.parentPhone} onChange={(v:any) => setFormData({...formData, parentPhone: v})} />
                <Field label="Address" value={formData.homeAddress} onChange={(v:any) => setFormData({...formData, homeAddress: v})} />
                <Select label="Sport" options={['Football', 'Basketball', 'Tennis', 'Volleyball', 'Badminton']} value={formData.sport} onChange={(v:any) => setFormData({...formData, sport: v})} />
                
                <button disabled={isSubmitting} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-amber-500 transition-all shadow-lg shadow-slate-200">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Database size={16} className="text-amber-400"/> Confirm Registration</>}
                </button>
              </form>
            </div>
          </aside>

          {/* COMPILATION LIST */}
          <main className="lg:col-span-8 space-y-4">
              {filteredAthletes.map((a: any) => (
                <div key={a.id} className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-amber-200 transition-all">
                  <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Fingerprint size={14} className="text-slate-300" />
                        <span className="text-[10px] font-mono font-bold text-slate-400">{a.athleteId}</span>
                    </div>
                    <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase italic tracking-tighter">{a.sport}</span>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Athlete Details</p>
                      <p className="font-black text-slate-900 uppercase text-sm">
                          {a.firstName} {a.middleName && <span className="text-slate-400">{a.middleName}</span>} {a.lastName}
                      </p>
                      <div className="flex gap-2 mt-2">
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase flex items-center gap-1"><Users size={10}/> {a.gender}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase flex items-center gap-1"><Calendar size={10}/> Age {a.age}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <Phone size={14} className="text-emerald-500 mt-0.5" />
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">Guardian Contact</p>
                                <p className="text-xs font-bold text-slate-700">{a.parentPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-amber-500 mt-0.5" />
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">Home Address</p>
                                <p className="text-xs font-bold text-slate-700 leading-tight">{a.homeAddress}</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-50 flex justify-end">
                      <button onClick={() => { if(window.confirm('Delete record?')) deleteDoc(doc(db, 'athletes', a.id)) }} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                  </div>
                </div>
              ))}
              {filteredAthletes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                  <p className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Registry Empty</p>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}