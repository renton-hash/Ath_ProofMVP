
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function BlogPage() {
  const { blogPosts } = useSite();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-8">Our Blog</h1>
        {blogPosts.length === 0 ? (
          <p className="text-slate-500">No posts yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2">{post.title}</h2>
                  <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}