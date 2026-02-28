import { useState } from 'react';
import { Trash2, Camera, RotateCcw, Loader2, Edit2, FileText, ImageIcon } from 'lucide-react';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useSite } from '../context/SiteContext';

// --- Image Uploader Component with Immediate Grid Preview ---
const ImageUpload = ({ label, images, setImages, max = 4 }: any) => {
  const displayImages = Array.isArray(images) ? images : images ? [images] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const limit = max - displayImages.length;

    filesArray.slice(0, limit).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          if (max === 1) {
            setImages(result); 
          } else {
            setImages((prev: any) => [...(Array.isArray(prev) ? prev : []), result]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''; // Allow re-uploading same file
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      
      <div className="relative h-28 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group">
        <input type="file" accept="image/*" multiple={max > 1} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
        <Camera className="text-slate-400 group-hover:text-amber-500 transition-colors" size={24} />
        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Add Media</p>
      </div>

      {displayImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <img src={img} className="w-full h-full object-cover" alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  if (max === 1) setImages('');
                  else setImages((prev: any[]) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-bl-lg hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function MediaDashboard() {
  const { blogPosts = [], galleryImages = [] } = useSite();
  const [tab, setTab] = useState<'blog' | 'gallery'>('blog');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const initBlog = { title: '', excerpt: '', content: '', image: '' };
  const initGallery = { images: [] as string[], captions: [] as string[] };

  const [blogForm, setBlogForm] = useState(initBlog);
  const [galleryForm, setGalleryForm] = useState(initGallery);

  const uploadToStorage = async (dataUrl: string, path: string) => {
    if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
    const storageRef = ref(storage, path);
    await uploadString(storageRef, dataUrl, 'data_url');
    return getDownloadURL(storageRef);
  };

  const handleBlogSubmit = async () => {
    if (!blogForm.title || !blogForm.image) return alert("Title and Image required");
    setIsSubmitting(true);
    try {
      const url = await uploadToStorage(blogForm.image, `blog/${Date.now()}.jpg`);
      const payload = { ...blogForm, image: url, timestamp: new Date() };
      
      if (editingId) {
        await updateDoc(doc(db, 'blogPosts', editingId), payload);
      } else {
        await addDoc(collection(db, 'blogPosts'), payload);
      }
      setBlogForm(initBlog);
      setEditingId(null);
      alert('Blog Published!');
    } catch (e) { console.error(e); alert('Permission Denied or Upload Error'); }
    finally { setIsSubmitting(false); }
  };

  const handleGallerySubmit = async () => {
    if (galleryForm.images.length === 0) return alert("Select images first");
    setIsSubmitting(true);
    try {
      for (let i = 0; i < galleryForm.images.length; i++) {
        const url = await uploadToStorage(galleryForm.images[i], `gallery/${Date.now()}-${i}.jpg`);
        // Matches the 'galleryImages' collection in your Rules
        await addDoc(collection(db, 'galleryImages'), {
          url,
          caption: galleryForm.captions[i] || '',
          timestamp: new Date()
        });
        setUploadProgress(Math.round(((i + 1) / galleryForm.images.length) * 100));
      }
      setGalleryForm(initGallery);
      alert('Gallery Updated!');
    } catch (e) { console.error(e); alert('Upload Failed'); }
    finally { setIsSubmitting(false); setUploadProgress(0); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Media Dashboard</h1>
          <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Content Management</p>
        </header>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
          <button onClick={() => setTab('blog')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${tab === 'blog' ? 'bg-amber-400 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
            <FileText size={14} /> Blog
          </button>
          <button onClick={() => setTab('gallery')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${tab === 'gallery' ? 'bg-amber-400 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
            <ImageIcon size={14} /> Gallery
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black text-xl uppercase italic">{editingId ? 'Edit' : 'New'} {tab}</h2>
                <button onClick={() => { setBlogForm(initBlog); setGalleryForm(initGallery); setEditingId(null); }} className="text-slate-300 hover:text-red-500 transition-colors"><RotateCcw size={18} /></button>
              </div>

              {tab === 'blog' ? (
                <div className="space-y-4">
                  <ImageUpload label="Cover Image" images={blogForm.image} setImages={(val: string) => setBlogForm({...blogForm, image: val})} max={1} />
                  <input placeholder="TITLE" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none font-bold uppercase text-sm focus:border-amber-400" />
                  <textarea placeholder="CONTENT" value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none font-bold uppercase text-sm h-32 resize-none focus:border-amber-400" />
                  <button disabled={isSubmitting} onClick={handleBlogSubmit} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-amber-400 transition-all uppercase text-xs flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageUpload label="Upload Photos (Max 4)" images={galleryForm.images} setImages={(val: any) => setGalleryForm({...galleryForm, images: val})} max={4} />
                  {galleryForm.images.map((_, i) => (
                    <input key={i} placeholder={`IMAGE CAPTION ${i+1}`} value={galleryForm.captions[i] || ''} onChange={(e) => {
                      const c = [...galleryForm.captions]; c[i] = e.target.value; setGalleryForm({...galleryForm, captions: c});
                    }} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none font-bold uppercase text-[10px]" />
                  ))}
                  {isSubmitting && <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-4"><div className="bg-amber-400 h-full transition-all" style={{width: `${uploadProgress}%`}} /></div>}
                  <button disabled={isSubmitting} onClick={handleGallerySubmit} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-amber-400 transition-all uppercase text-xs">
                    {isSubmitting ? `Uploading ${uploadProgress}%` : 'Add to Gallery'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 min-h-[600px]">
              {tab === 'blog' ? (
                <div className="grid gap-6">
                  {blogPosts.map((post: any) => (
                    <div key={post.id} className="flex gap-4 p-4 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all group">
                      <img src={post.image} className="w-24 h-24 rounded-2xl object-cover bg-slate-100" />
                      <div className="flex-1">
                        <h4 className="font-black uppercase italic text-slate-800">{post.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.content}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => { setEditingId(post.id); setBlogForm(post); }} className="p-2 text-slate-300 hover:text-amber-500 transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => window.confirm('Delete Post?') && deleteDoc(doc(db, 'blogPosts', post.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((img: any) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm bg-slate-100">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                         <button onClick={() => window.confirm('Delete Image?') && deleteDoc(doc(db, 'galleryImages', img.id))} className="bg-red-500 p-3 rounded-xl text-white hover:bg-red-600 transition-colors"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}