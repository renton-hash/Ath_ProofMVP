import { useState, useEffect } from 'react';
import { Newspaper, Image as ImageIcon, Plus, Trash2, Loader2, X, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export function MediaDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const blogSnap = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')));
      const gallerySnap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')));
      setPosts(blogSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setImages(gallerySnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'blogs'), {
        ...newBlog,
        createdAt: serverTimestamp(),
      });
      setShowBlogModal(false);
      setNewBlog({ title: '', content: '' });
      fetchMedia();
    } catch (err) { alert("Error creating post"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const fileRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        await addDoc(collection(db, 'gallery'), {
          url,
          storagePath: fileRef.fullPath,
          createdAt: serverTimestamp()
        });
      }
      fetchMedia();
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleDelete = async (coll: string, id: string, path?: string) => {
    if (!confirm("Delete permanently?")) return;
    try {
      await deleteDoc(doc(db, coll, id));
      if (path) await deleteObject(ref(storage, path));
      fetchMedia();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-20 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic">Media Hub</h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Publish Content & Gallery Moments</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* BLOGS */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black flex items-center gap-2 italic text-slate-900"><Newspaper size={20} className="text-amber-500"/> BLOG POSTS</h2>
              <button 
                onClick={() => setShowBlogModal(true)}
                className="p-2.5 bg-amber-400 rounded-2xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
              >
                <Plus size={20} className="text-slate-900"/>
              </button>
            </div>
            
            <div className="space-y-4">
              {posts.map(p => (
                <div key={p.id} className="flex justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700">
                  <div className="flex flex-col">
                    <span className="uppercase text-xs tracking-tight">{p.title}</span>
                    <span className="text-[9px] text-slate-400">Post ID: {p.id.substring(0,8)}</span>
                  </div>
                  <button onClick={() => handleDelete('blogs', p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </section>

          {/* GALLERY */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black flex items-center gap-2 italic text-slate-900"><ImageIcon size={20} className="text-amber-500"/> GALLERY</h2>
              <label className="p-2.5 bg-slate-900 text-amber-400 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all">
                {uploading ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20}/>}
                <input type="file" className="hidden" multiple onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.map(img => (
                <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <button onClick={() => handleDelete('gallery', img.id, img.storagePath)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* BLOG MODAL */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => setShowBlogModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-6">Create New Post</h2>
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <input 
                placeholder="Post Title"
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-bold"
                value={newBlog.title}
                onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                required
              />
              <textarea 
                placeholder="Content..."
                rows={5}
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-bold"
                value={newBlog.content}
                onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                required
              />
              <button className="w-full py-4 bg-[#0F172A] text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">
                Publish Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}