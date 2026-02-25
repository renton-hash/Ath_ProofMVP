import  { useState, createElement } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Download,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp } from
'lucide-react';
import { CountdownTimer } from '../components/CountdownTimer';
import { Footer } from '../components/Footer';
import { eventSchedule } from '../data/mockData';
const FLYER_URL = "/IfeYouth.jpg";

const lectureNotes = [
{
  title: 'Sports Nutrition for Youth Athletes',
  author: 'Dr. Adewale Okafor',
  date: 'Feb 25, 2026',
  type: 'PDF'
},
{
  title: 'Mental Toughness in Competition',
  author: 'Prof. Funke Adeyemi',
  date: 'Feb 26, 2026',
  type: 'PDF'
},
{
  title: 'Injury Prevention & Recovery',
  author: 'Dr. Emeka Nwosu',
  date: 'Feb 27, 2026',
  type: 'PDF'
},
{
  title: 'Career Pathways in Sports',
  author: 'Coach Biodun Fashola',
  date: 'Feb 28, 2026',
  type: 'PDF'
}];

const galleryItems = [
{
  label: 'Opening Ceremony',
  emoji: '🎉'
},
{
  label: 'Football Training',
  emoji: '⚽'
},
{
  label: 'Basketball Match',
  emoji: '🏀'
},
{
  label: 'Tennis Practice',
  emoji: '🎾'
},
{
  label: 'Volleyball Finals',
  emoji: '🏐'
},
{
  label: 'Award Ceremony',
  emoji: '🏆'
}];

export function EventPage() {
  const [expandedDay, setExpandedDay] = useState<string | null>('Day 1');
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
  const handleDownloadFlyer = () => {
    const link = document.createElement('a');
    link.href = FLYER_URL;
    link.download = 'IYSDC-2026-Flyer.jpg';
    link.target = '_blank';
    link.click();
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-navy text-white px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors">

          <Shield size={18} />
          <span className="font-heading text-lg">ATH-PROOF</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors">

          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <img
          src={FLYER_URL}
          alt="IYSDC 2026"
          className="w-full h-full object-cover object-top" />

        <div className="absolute inset-0 bg-navy/80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
              IYSDC 2026 • Maiden Edition
            </p>
            <h1 className="font-heading text-5xl md:text-6xl text-white">
              EVENT INFORMATION
            </h1>
            <p className="text-gray-300 mt-2">
              February 25–28, 2026 • Ife Grand Resort, Ile-Ife
            </p>
          </div>
        </div>
      </section>

      <CountdownTimer />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Event Details */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
            {
              icon: <Calendar size={20} />,
              title: 'Event Dates',
              detail: 'February 25–28, 2026',
              sub: '4 Days of Competition'
            },
            {
              icon: <MapPin size={20} />,
              title: 'Venue',
              detail: 'Ife Grand Resort',
              sub: 'Ile-Ife, Osun State'
            },
            {
              icon: <Clock size={20} />,
              title: 'Opening',
              detail: '08:00 AM',
              sub: 'February 25, 2026'
            }].
            map((item) =>
            <div
              key={item.title}
              className="bg-navy rounded-xl p-5 text-center">

                <div className="text-gold mb-2 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-heading text-lg text-gold">{item.title}</h3>
                <p className="text-white font-semibold text-sm">
                  {item.detail}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownloadFlyer}
              className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-bold rounded-full hover:bg-gold-light transition-all text-sm">

              <Download size={16} /> Download Event Flyer
            </button>
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white font-bold rounded-full hover:bg-navy-light transition-all text-sm">

              Register for Event
            </Link>
          </div>
        </section>

        {/* Schedule */}
        <section>
          <h2 className="font-heading text-4xl text-navy mb-6">
            COMPETITION SCHEDULE
          </h2>
          <div className="space-y-3">
            {days.map((day) => {
              const dayEvents = eventSchedule.filter((e) => e.day === day);
              const isOpen = expandedDay === day;
              return (
                <div
                  key={day}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                  <button
                    onClick={() => setExpandedDay(isOpen ? null : day)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">

                    <div className="flex items-center gap-3">
                      <span className="bg-navy text-gold font-heading text-sm px-3 py-1 rounded-full">
                        {day}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {dayEvents[0]?.date}
                      </span>
                      <span className="text-xs text-gray-400">
                        {dayEvents.length} events
                      </span>
                    </div>
                    {isOpen ?
                    <ChevronUp size={16} className="text-gray-400" /> :

                    <ChevronDown size={16} className="text-gray-400" />
                    }
                  </button>
                  {isOpen &&
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1
                    }}
                    className="border-t border-gray-100">

                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            {[
                          'Time',
                          'Sport',
                          'Category',
                          'Venue',
                          'Status'].
                          map((h) =>
                          <th
                            key={h}
                            className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">

                                {h}
                              </th>
                          )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {dayEvents.map((e, i) =>
                        <tr key={i} className="hover:bg-gold/5">
                              <td className="px-4 py-3 text-xs font-id font-semibold text-navy">
                                {e.time}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                {e.sport}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {e.category}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {e.venue}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                  {e.status}
                                </span>
                              </td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                    </motion.div>
                  }
                </div>);

            })}
          </div>
        </section>

        {/* Live Stream */}
        <section>
          <h2 className="font-heading text-4xl text-navy mb-4">LIVE STREAM</h2>
          <div className="bg-navy rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📺</div>
              <p className="font-heading text-2xl text-gold mb-2">
                LIVE STREAM
              </p>
              <p className="text-gray-300 text-sm">
                Live streaming begins February 25, 2026
              </p>
              <button className="mt-4 px-6 py-2.5 bg-gold text-navy font-bold rounded-full text-sm hover:bg-gold-light transition-all">
                Set Reminder
              </button>
            </div>
          </div>
        </section>

        {/* Lecture Notes */}
        <section>
          <h2 className="font-heading text-4xl text-navy mb-4">
            LECTURE NOTES & RESOURCES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectureNotes.map((note, i) =>
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">

                <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  📄
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {note.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {note.author} • {note.date}
                  </p>
                </div>
                <button
                onClick={() => alert(`Downloading: ${note.title}`)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-dark">

                  <Download size={12} /> {note.type}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="font-heading text-4xl text-navy mb-4">
            PHOTO GALLERY
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item, i) =>
            <div
              key={i}
              className="aspect-square bg-navy/5 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-gold transition-all cursor-pointer group">

                <div className="text-5xl group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {item.label}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>);

}