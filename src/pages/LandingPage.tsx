import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSite } from '../context/SiteContext';

const heroSlides = [
  { url: '/slider/DSC_5145.jpg', alt: 'Training Session' },
  { url: '/slider/DSC_5175.jpg', alt: 'Competitions' },
  { url: '/slider/DSC_5269.jpg', alt: 'Team Building' },
  { url: '/slider/DSC_5304.jpg', alt: 'The Making' },
  { url: '/slider/DSC_5314.jpg', alt: 'The Future' },
];

export function LandingPage() {
  const { blogPosts = [] } = useSite(); // ✅ default to empty array
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index: number) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
    }),
    center: {
      x: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -400 : 400,
    }),
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentSlide}
              src={heroSlides[currentSlide].url}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 90, damping: 25 } }}
              className="absolute w-full h-full object-cover"
              alt={heroSlides[currentSlide].alt}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 }}
            className="max-w-4xl"
          >
            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-8 uppercase italic">
              Train <br />
              <span className="text-amber-400">Harder.</span>
            </h1>

            <p className="text-slate-300 text-xl md:text-2xl mb-12 max-w-2xl font-medium leading-relaxed">
              Ife Youth Sports Camp 2026. High-performance training for the next generation of champions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/registration"
                className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-3 shadow-2xl uppercase tracking-tight"
              >
                Register Now <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                currentSlide === idx ? 'w-12 bg-amber-400' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* BLOG POSTS SECTION */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-4xl font-black mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white shadow-lg rounded-xl p-6">
                <img
                  src={post.image || '/slider/DSC_5145.jpg'}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                <p className="text-slate-600 text-sm">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-3 inline-block text-amber-400 font-semibold hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <CountdownTimer />

      <footer className="py-12 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
        <Link
          to="/login"
          className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-amber-500 transition-colors uppercase tracking-[0.3em]"
        >
          <LogIn size={14} /> Admin Access
        </Link>
      </footer>

      <Footer />
    </div>
  );
}