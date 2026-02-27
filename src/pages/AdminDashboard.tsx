import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Loader2, Trash2, Download, Search, 
  Phone, FileText, Fingerprint, Calendar, Users, Database, 
  Camera, Save, X, Edit2, MapPin, ShieldCheck
} from 'lucide-react';
import { db } from '../firebase/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 

// --- Helper Field Component ---
const Field = ({ label, value, onChange, type = "text", required = true }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
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
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    homeAddress: '', parentPhone: '', 
    sport: 'Football', age: '', gender: 'Male', dob: '', photo: ''
  });

  // --- Image Processing & Validation ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB < 200 || fileSizeKB > 1000) {
      alert(`Invalid File Size: ${fileSizeKB.toFixed(0)}KB. Use 200KB - 1MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height);
        canvas.width = 500; canvas.height = 500;
        if (ctx) {
          ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 500, 500);
          const base64 = canvas.toDataURL('image/jpeg', 0.9);
          isEdit ? setEditData({ ...editData, photo: base64 }) : setFormData({ ...formData, photo: base64 });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age.toString();
  };

  // --- PROFESSIONAL ID CARD GENERATOR ---
  const downloadProfessionalID = (a: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Branded Header Box
    doc.setFillColor(15, 23, 42); // Navy Blue
    doc.rect(10, 10, 190, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("IYSDC OFFICIAL ATHLETE", 105, 26, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("INTERNATIONAL YOUTH SPORTS DEVELOPMENT COMMISSION", 105, 36, { align: 'center' });

    // Participant Photo with Border
    if (a.photo) {
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(1);
      doc.rect(75, 65, 60, 60);
      doc.addImage(a.photo, 'JPEG', 75, 65, 60, 60);
    }

    // Main Info Table (Fixed TS Error using cellWidth)
    autoTable(doc, {
      startY: 135,
      margin: { left: 25, right: 25 },
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 4, textColor: [30, 41, 59] },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 45, textColor: [100, 116, 139] },
        1: { cellWidth: 'auto' }
      },
      body: [
        ["ATHLETE NAME", `${a.firstName} ${a.lastName}`.toUpperCase()],
        ["REGISTRATION ID", a.athleteId],
        ["DATE OF BIRTH", a.dob],
        ["AGE CATEGORY", `${a.age} YEARS`],
        ["ASSIGNED SPORT", a.sport.toUpperCase()],
        ["GENDER", a.gender.toUpperCase()],
        ["EMERGENCY NO", a.parentPhone],
        ["RESIDENCE", a.homeAddress.toUpperCase()]
      ]
    });

    // Footer / Verification Area
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    doc.setDrawColor(226, 232, 240);
    doc.line(25, finalY + 10, 185, finalY + 10);
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("This document serves as official identification for IYSDC events. Non-transferable.", 105, finalY + 18, { align: 'center' });
    
    // Official Stamp Placeholder
    doc.setDrawColor(15, 23, 42);
    doc.circle(170, finalY + 35, 12, 'S');
    doc.setFontSize(5);
    doc.text("OFFICIAL", 170, finalY + 34, { align: 'center' });
    doc.text("SEAL", 170, finalY + 37, { align: 'center' });

    doc.save(`${a.athleteId}_ID_CARD.pdf`);
  };

  const downloadGeneralReport = () => {
    const doc = new jsPDF('l');
    const tableColumn = ["ID", "Name", "Sex", "DOB", "Age", "Sport", "Phone", "Address"];
    const tableRows = (athletes || []).map(a => [
      a.athleteId, `${a.firstName} ${a.lastName}`, a.gender, a.dob, a.age, a.sport, a.parentPhone, a.homeAddress
    ]);
    doc.setFontSize(16);
    doc.text("IYSDC MASTER REGISTRY - DATA ONLY", 14, 15);
    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 20, 
      styles: { fontSize: 8 }, 
      headStyles: { fillColor: [15, 23, 42] } 
    });
    doc.save("IYSDC_Master_Registry.pdf");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(calculateAge(formData.dob));
    if (ageNum < 7 || ageNum > 20) { setStatus({ type: 'error', msg: 'AGE MUST BE 7-20' }); return; }
    if (!formData.photo) { setStatus({ type: 'error', msg: 'PHOTO REQUIRED' }); return; }
    setIsSubmitting(true);
    try {
      const athleteId = `IYSDC-26-${Math.floor(1000 + Math.random() * 9000)}`;
      await addAthlete({ ...formData, age: ageNum.toString(), athleteId, timestamp: new Date() });
      setFormData({ firstName: '', middleName: '', lastName: '', homeAddress: '', parentPhone: '', sport: 'Football', age: '', gender: 'Male', dob: '', photo: '' });
      setStatus({ type: 'success', msg: `SAVED: ${athleteId}` });
    } catch (err) { setStatus({ type: 'error', msg: 'SAVE FAILED' }); }
    finally { setIsSubmitting(false); setTimeout(() => setStatus(null), 5000); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR REGISTRATION */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl sticky top-28">
            <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><UserPlus size={18} className="text-amber-500" /> New Registry Entry</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-amber-400 transition-all">
                    {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" />}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e)} />
                </label>
                <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase">Headshot: 200KB - 1MB</p>
              </div>
              <Field label="First Name" value={formData.firstName} onChange={(v:any) => setFormData({...formData, firstName: v})} />
              <Field label="Last Name" value={formData.lastName} onChange={(v:any) => setFormData({...formData, lastName: v})} />
              <Field type="date" label="Date of Birth" value={formData.dob} onChange={(v:any) => setFormData({...formData, dob: v})} />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Gender" options={['Male', 'Female']} value={formData.gender} onChange={(v:any) => setFormData({...formData, gender: v})} />
                <Select label="Sport" options={['Football', 'Basketball', 'Tennis', 'Volleyball']} value={formData.sport} onChange={(v:any) => setFormData({...formData, sport: v})} />
              </div>
              <Field label="Guardian Phone" value={formData.parentPhone} onChange={(v:any) => setFormData({...formData, parentPhone: v})} />
              <Field label="Home Address" value={formData.homeAddress} onChange={(v:any) => setFormData({...formData, homeAddress: v})} />
              <button disabled={isSubmitting} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-amber-500 transition-all shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Participant'}
              </button>
            </form>
          </div>
        </aside>

        {/* MAIN DATABASE VIEW */}
        <main className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
              <Search size={18} className="text-slate-300" />
              <input placeholder="SEARCH DATABASE..." className="bg-transparent outline-none w-full font-bold text-xs uppercase" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={downloadGeneralReport} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all" title="Download Report (No Images)">
              <Download size={18} />
            </button>
          </div>

          {athletes?.filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map((a: any) => (
            <div key={a.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-amber-400 transition-all group">
              {editingId === a.id ? (
                <div className="p-8 bg-slate-50/50 grid grid-cols-2 gap-4">
                  <Field label="First Name" value={editData.firstName} onChange={(v:any) => setEditData({...editData, firstName: v})} />
                  <Field label="Last Name" value={editData.lastName} onChange={(v:any) => setEditData({...editData, lastName: v})} />
                  <Field type="date" label="DOB" value={editData.dob} onChange={(v:any) => setEditData({...editData, dob: v})} />
                  <Select label="Sport" options={['Football', 'Basketball', 'Tennis', 'Volleyball']} value={editData.sport} onChange={(v:any) => setEditData({...editData, sport: v})} />
                  <Field label="Address" value={editData.homeAddress} onChange={(v:any) => setEditData({...editData, homeAddress: v})} />
                  <Field label="Phone" value={editData.parentPhone} onChange={(v:any) => setEditData({...editData, parentPhone: v})} />
                  <div className="col-span-2 flex gap-2">
                    <button onClick={async () => { await updateDoc(doc(db, 'athletes', a.id), {...editData, age: calculateAge(editData.dob)}); setEditingId(null); }} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Update Athlete</button>
                    <button onClick={() => setEditingId(null)} className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img src={a.photo} className="w-24 h-24 rounded-3xl object-cover border-2 border-white shadow-md" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                      <ShieldCheck size={12} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Fingerprint size={12} className="text-slate-300" />
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{a.athleteId}</span>
                    </div>
                    <h3 className="font-black text-slate-900 uppercase text-xl leading-none">{a.firstName} {a.lastName}</h3>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Calendar size={14} className="text-amber-500"/> {a.dob} ({a.age}y)</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Users size={14} className="text-blue-500"/> {a.gender} | {a.sport}</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Phone size={14} className="text-emerald-500"/> {a.parentPhone}</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase truncate"><MapPin size={14} className="text-rose-500"/> {a.homeAddress}</div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2">
                    <button onClick={() => downloadProfessionalID(a)} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-sm" title="Print Professional ID">
                      <FileText size={18} />
                    </button>
                    <button onClick={() => { setEditingId(a.id); setEditData(a); }} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => window.confirm("Permanently delete athlete?") && deleteDoc(doc(db, 'athletes', a.id))} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
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