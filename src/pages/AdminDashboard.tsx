import React, { useState } from 'react';
import { 
  UserPlus, Loader2, Trash2, Search, Phone, FileText, 
  Calendar, Users, Camera, MapPin, ShieldCheck, Edit2, X, Check, Download, Trophy
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';
import { jsPDF } from 'jspdf'; 
import autoTable from 'jspdf-autotable';

// --- Form Helper Components ---
const Field = ({ label, value, onChange, type = "text", required = true }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {!required && <span className="text-slate-300 font-normal">(Optional)</span>}
    </label>
    <input 
      required={required} type={type} value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-800 focus:border-amber-400 transition-all uppercase" 
    />
  </div>
);

const Select = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      value={value} onChange={(e) => onChange(e.target.value)} 
      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 uppercase outline-none focus:border-amber-400"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export function AdminDashboard() {
  const { athletes, addAthlete } = useSite();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', homeAddress: '', 
    parentPhone: '', gender: 'Male', dob: '', photo: '', sport: 'Football'
  });

  const sportsList = ['Football', 'Basketball', 'Athletics', 'Swimming', 'Tennis', 'Volleyball', 'Combat Sports'];

  const processImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400; canvas.height = 400;
        const size = Math.min(img.width, img.height);
        if (ctx) {
          ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 400, 400);
          callback(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (id: string) => {
    setIsUpdating(true);
    try {
      const athleteRef = doc(db, 'athletes', id);
      // Remove ID from payload to avoid self-referential overwrite errors
      const { id: _, ...payload } = editData; 
      await updateDoc(athleteRef, payload);
      setEditingId(null);
      alert("Athlete profile updated successfully!");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- PDF Generators (kept as is) ---
  const downloadGeneralRegistry = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text("IYSDC 2026 GENERAL REGISTRY", 14, 20);
    const tableData = athletes.map((a: any, index: number) => [
      (index + 1).toString().padStart(3, '0'), a.athleteId, `${a.firstName} ${a.lastName}`.toUpperCase(),
      a.sport.toUpperCase(), a.gender.toUpperCase(), a.dob, a.parentPhone, a.homeAddress.toUpperCase()
    ]);
    autoTable(doc, { startY: 30, head: [['S/N', 'REG ID', 'FULL NAME', 'SPORT', 'GENDER', 'DOB', 'PHONE', 'ADDRESS']], body: tableData });
    doc.save(`IYSDC_Registry_Master.pdf`);
  };

  const downloadPortraitID = (a: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [53.9, 85.6] });
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, 53.9, 22, 'F');
    if (a.photo) doc.addImage(a.photo, 'JPEG', 14.95, 16, 24, 24);
    doc.save(`${a.firstName}_ID.pdf`);
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo) return alert("Please upload photo.");
    setIsSubmitting(true);
    const id = `ID-26-${Math.floor(100000 + Math.random() * 899999)}`;
    await addAthlete({ ...formData, athleteId: id, timestamp: new Date() });
    setFormData({ firstName: '', middleName: '', lastName: '', homeAddress: '', parentPhone: '', gender: 'Male', dob: '', photo: '', sport: 'Football' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR REGISTRATION FORM */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl sticky top-28">
            <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserPlus size={18} className="text-amber-500" /> New Registration
            </h2>
            <form onSubmit={onRegister} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <label className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden hover:border-amber-400">
                  {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0], (b) => setFormData({...formData, photo: b}))} />
                </label>
              </div>
              <Field label="First Name" value={formData.firstName} onChange={(v:any) => setFormData({...formData, firstName: v})} />
              <Field label="Middle Name" required={false} value={formData.middleName} onChange={(v:any) => setFormData({...formData, middleName: v})} />
              <Field label="Last Name" value={formData.lastName} onChange={(v:any) => setFormData({...formData, lastName: v})} />
              <div className="grid grid-cols-2 gap-3">
                <Field type="date" label="DOB" value={formData.dob} onChange={(v:any) => setFormData({...formData, dob: v})} />
                <Select label="Gender" options={['Male', 'Female']} value={formData.gender} onChange={(v:any) => setFormData({...formData, gender: v})} />
              </div>
              <Select label="Sport" options={sportsList} value={formData.sport} onChange={(v:any) => setFormData({...formData, sport: v})} />
              <Field label="Guardian Phone" value={formData.parentPhone} onChange={(v:any) => setFormData({...formData, parentPhone: v})} />
              <Field label="Home Address" value={formData.homeAddress} onChange={(v:any) => setFormData({...formData, homeAddress: v})} />
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] hover:bg-amber-500 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Create Athlete Record'}
              </button>
            </form>
          </div>
        </aside>

        {/* REGISTRY LIST */}
        <main className="lg:col-span-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
              <Search size={18} className="text-slate-300" />
              <input placeholder="SEARCH REGISTRY..." className="bg-transparent outline-none w-full font-bold text-xs" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={downloadGeneralRegistry} className="bg-emerald-600 text-white px-8 py-4 rounded-3xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
              <Download size={16} /> Export Registry
            </button>
          </div>

          {athletes?.filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map((a: any, idx: number) => (
            <div key={a.id} className="bg-white rounded-[2rem] border border-slate-200 hover:border-amber-400 transition-all shadow-sm overflow-hidden">
              
              {editingId === a.id ? (
                // --- FULLY EDITABLE MODE ---
                <div className="p-8 bg-slate-50/50">
                  <div className="flex items-center gap-6 mb-8 border-b border-slate-200 pb-6">
                    <label className="relative w-20 h-20 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center cursor-pointer overflow-hidden group">
                      <img src={editData.photo} className="w-full h-full object-cover group-hover:opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={20} className="text-slate-900" />
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0], (b) => setEditData({...editData, photo: b}))} />
                    </label>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase">Updating Archive</h4>
                      <p className="text-[10px] font-bold text-slate-400">REF: {a.athleteId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <Field label="First Name" value={editData.firstName} onChange={(v:any) => setEditData({...editData, firstName: v})} />
                    <Field label="Middle Name" value={editData.middleName} onChange={(v:any) => setEditData({...editData, middleName: v})} />
                    <Field label="Last Name" value={editData.lastName} onChange={(v:any) => setEditData({...editData, lastName: v})} />
                    <Field label="Phone" value={editData.parentPhone} onChange={(v:any) => setEditData({...editData, parentPhone: v})} />
                    <Field type="date" label="DOB" value={editData.dob} onChange={(v:any) => setEditData({...editData, dob: v})} />
                    <Select label="Gender" options={['Male', 'Female']} value={editData.gender} onChange={(v:any) => setEditData({...editData, gender: v})} />
                    <Select label="Sport" options={sportsList} value={editData.sport} onChange={(v:any) => setEditData({...editData, sport: v})} />
                    <Field label="Address" value={editData.homeAddress} onChange={(v:any) => setEditData({...editData, homeAddress: v})} />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleUpdate(a.id)} 
                      disabled={isUpdating}
                      className="flex-1 py-4 bg-slate-900 text-amber-400 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
                    >
                      {isUpdating ? <Loader2 className="animate-spin" /> : <><Check size={16}/> Save Changes</>}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-8 py-4 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                // --- STANDARD VIEW MODE ---
                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img src={a.photo} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100" />
                    <div className="absolute -top-2 -left-2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-md">#{(idx + 1).toString().padStart(3, '0')}</div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <span className="text-[9px] font-bold text-slate-400 tracking-widest">{a.athleteId}</span>
                      <span className="text-[8px] px-2 py-0.5 bg-slate-100 rounded-full font-black text-slate-600 uppercase tracking-tighter">{a.sport}</span>
                    </div>
                    <h3 className="font-black text-slate-900 uppercase text-lg leading-tight">{a.firstName} {a.middleName} {a.lastName}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{a.homeAddress}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => downloadPortraitID(a)} className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-amber-500 transition-all"><FileText size={20} /></button>
                    <button onClick={() => { setEditingId(a.id); setEditData({...a}); }} className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-slate-200 transition-all"><Edit2 size={20} /></button>
                    <button onClick={() => window.confirm("Delete Record?") && deleteDoc(doc(db, 'athletes', a.id))} className="bg-slate-50 text-slate-200 p-3 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={20} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}