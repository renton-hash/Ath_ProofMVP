import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Download,
  Trophy,
  MapPin,
  School,
  User,
  Calendar } from
'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip } from
'recharts';
import { mockAthletes } from '../data/mockData';
const performanceHistory = [
{
  month: 'Oct',
  score: 65
},
{
  month: 'Nov',
  score: 70
},
{
  month: 'Dec',
  score: 72
},
{
  month: 'Jan',
  score: 78
},
{
  month: 'Feb',
  score: 82
}];

const competitionHistory = [
{
  event: 'Osun State Youth Games',
  date: 'Nov 2025',
  sport: 'Football',
  result: 'Semi-Final',
  medal: '🥈'
},
{
  event: 'Ife Central Schools Cup',
  date: 'Dec 2025',
  sport: 'Football',
  result: '1st Place',
  medal: '🥇'
},
{
  event: 'IYSDC 2026 Qualifier',
  date: 'Jan 2026',
  sport: 'Football',
  result: 'Qualified',
  medal: '✅'
}];

export function AthletePage() {
  const { id } = useParams<{
    id: string;
  }>();
  const [activeTab, setActiveTab] = useState('info');
  const athlete = mockAthletes.find((a) => a.id === id) || mockAthletes[0];
  const radarData = [
  {
    subject: 'Speed',
    value: athlete.speed
  },
  {
    subject: 'Endurance',
    value: athlete.endurance
  },
  {
    subject: 'Strength',
    value: athlete.strength
  },
  {
    subject: 'Technique',
    value: athlete.technique
  },
  {
    subject: 'Teamwork',
    value: athlete.teamwork
  }];

  const handleDownloadCard = () => {
    alert(
      `Generating ID Card PDF for ${athlete.id}...\n\nIn production, this would download a PDF ID card.`
    );
  };
  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-navy rounded-2xl overflow-hidden mb-6 shadow-xl">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-navy font-heading text-4xl shrink-0 shadow-lg">
              {athlete.firstName[0]}
            </div>
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-heading text-3xl md:text-4xl text-white">
                  {athlete.firstName.toUpperCase()}{' '}
                  {athlete.lastName.toUpperCase()}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${athlete.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>

                  {athlete.status}
                </span>
              </div>
              <p className="font-id text-gold text-lg font-bold mb-3">
                {athlete.id}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-gold" />
                  {athlete.sport}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gold" />
                  Age {athlete.age} • {athlete.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gold" />
                  {athlete.lga}, {athlete.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <School size={14} className="text-gold" />
                  {athlete.school}
                </span>
              </div>
            </div>
            <button
              onClick={handleDownloadCard}
              className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all text-sm shrink-0">

              <Download size={16} /> Download ID Card
            </button>
          </div>
        </div>

        {/* ID Card Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200">
              <div className="bg-navy p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gold p-1 rounded">
                      <Shield size={12} className="text-navy" />
                    </div>
                    <span className="font-heading text-sm text-white">
                      ATH-PROOF
                    </span>
                  </div>
                  <span className="text-xs bg-gold text-navy font-bold px-2 py-0.5 rounded">
                    ATHLETE
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  IFE Youth Sports Development Camp 2026
                </p>
              </div>
              <div className="bg-white p-5 text-center">
                <div className="w-20 h-20 bg-navy rounded-full mx-auto mb-3 border-4 border-gray-100 flex items-center justify-center text-gold font-heading text-2xl">
                  {athlete.firstName[0]}
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-0.5">
                  {athlete.firstName} {athlete.lastName}
                </h4>
                <p className="font-id text-sm font-bold text-navy mb-1">
                  {athlete.id}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {athlete.sport} • {athlete.category}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-left mb-3 bg-gray-50 rounded-lg p-2">
                  <div>
                    <span className="text-gray-400 block">School</span>
                    <span className="font-semibold text-xs">
                      {athlete.school.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">LGA</span>
                    <span className="font-semibold">{athlete.lga}</span>
                  </div>
                </div>
                <div className="w-full h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border border-gray-200">
                  ▮▮▮▮ QR Code ▮▮▮▮
                </div>
              </div>
              <div className="bg-gray-50 p-2 text-center text-[9px] text-gray-400 border-t border-gray-100">
                In honor of the Ooni Coronation Anniversary
              </div>
            </div>
            <button
              onClick={handleDownloadCard}
              className="mt-3 w-full py-2.5 bg-navy text-white font-bold rounded-xl hover:bg-navy-light transition-all text-sm flex items-center justify-center gap-2">

              <Download size={14} /> Download PDF ID Card
            </button>
          </div>

          {/* Tabs Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {['info', 'performance', 'competitions', 'coach'].map((tab) =>
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-navy' : 'text-gray-400 hover:text-gray-600'}`}>

                    {tab === 'info' ?
                  'Personal Info' :
                  tab === 'performance' ?
                  'Performance' :
                  tab === 'competitions' ?
                  'Competition History' :
                  'Coach Info'}
                    {activeTab === tab &&
                  <motion.div
                    layoutId="athleteTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />

                  }
                  </button>
                )}
              </div>
              <div className="p-5">
                {activeTab === 'info' &&
                <div className="grid grid-cols-2 gap-3">
                    {[
                  {
                    label: 'Athlete ID',
                    value: athlete.id
                  },
                  {
                    label: 'Full Name',
                    value: `${athlete.firstName} ${athlete.lastName}`
                  },
                  {
                    label: 'Date of Birth',
                    value: athlete.dob
                  },
                  {
                    label: 'Age',
                    value: `${athlete.age} years`
                  },
                  {
                    label: 'Gender',
                    value: athlete.gender
                  },
                  {
                    label: 'Sport',
                    value: athlete.sport
                  },
                  {
                    label: 'Category',
                    value: athlete.category
                  },
                  {
                    label: 'School',
                    value: athlete.school
                  },
                  {
                    label: 'LGA',
                    value: athlete.lga
                  },
                  {
                    label: 'State',
                    value: athlete.state
                  },
                  {
                    label: 'Status',
                    value: athlete.status
                  },
                  {
                    label: 'Registered By',
                    value: athlete.registeredBy
                  }].
                  map((item) =>
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-lg p-3">

                        <p className="text-xs text-gray-400 mb-0.5">
                          {item.label}
                        </p>
                        <p
                      className={`text-sm font-semibold text-navy ${item.label.includes('ID') || item.label === 'Registered By' ? 'font-id' : ''}`}>

                          {item.value}
                        </p>
                      </div>
                  )}
                  </div>
                }
                {activeTab === 'performance' &&
                <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {[
                    {
                      label: 'Speed',
                      value: athlete.speed
                    },
                    {
                      label: 'Endurance',
                      value: athlete.endurance
                    },
                    {
                      label: 'Strength',
                      value: athlete.strength
                    },
                    {
                      label: 'Technique',
                      value: athlete.technique
                    },
                    {
                      label: 'Teamwork',
                      value: athlete.teamwork
                    }].
                    map((m) =>
                    <div
                      key={m.label}
                      className="text-center bg-navy/5 rounded-xl p-3">

                          <p className="font-heading text-2xl text-navy">
                            {m.value}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {m.label}
                          </p>
                          <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                          className="h-full bg-gold rounded-full"
                          style={{
                            width: `${m.value * 10}%`
                          }} />

                          </div>
                        </div>
                    )}
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fontSize: 10
                        }} />

                        <PolarRadiusAxis
                        angle={30}
                        domain={[0, 10]}
                        tick={{
                          fontSize: 8
                        }} />

                        <Radar
                        dataKey="value"
                        stroke="#C9A84C"
                        fill="#C9A84C"
                        fillOpacity={0.3} />

                      </RadarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={140}>
                      <LineChart data={performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 10
                        }} />

                        <YAxis
                        domain={[50, 100]}
                        tick={{
                          fontSize: 10
                        }} />

                        <Tooltip />
                        <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#C9A84C"
                        strokeWidth={2}
                        dot={{
                          r: 3
                        }}
                        name="Overall Score" />

                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                }
                {activeTab === 'competitions' &&
                <div className="space-y-3">
                    {competitionHistory.map((c, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">

                        <div className="text-2xl">{c.medal}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">
                            {c.event}
                          </p>
                          <p className="text-xs text-gray-400">
                            {c.date} • {c.sport}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-navy bg-navy/10 px-2 py-0.5 rounded-full">
                          {c.result}
                        </span>
                      </div>
                  )}
                  </div>
                }
                {activeTab === 'coach' &&
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-navy/5 rounded-xl border border-navy/10">
                      <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center text-gold font-heading text-xl">
                        AO
                      </div>
                      <div>
                        <p className="font-bold text-navy">
                          Coach Adewale Ogundimu
                        </p>
                        <p className="text-xs font-id text-gray-500">
                          {athlete.coachId}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Football • UEFA B License
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                    {
                      label: 'Coach ID',
                      value: athlete.coachId
                    },
                    {
                      label: 'Specialty',
                      value: athlete.sport
                    },
                    {
                      label: 'Email',
                      value: 'adewale.ogundimu@iysdi.org'
                    },
                    {
                      label: 'Phone',
                      value: '+234 803 111 2222'
                    }].
                    map((item) =>
                    <div
                      key={item.label}
                      className="bg-gray-50 rounded-lg p-3">

                          <p className="text-xs text-gray-400 mb-0.5">
                            {item.label}
                          </p>
                          <p
                        className={`text-sm font-semibold text-navy ${item.label.includes('ID') ? 'font-id' : ''}`}>

                            {item.value}
                          </p>
                        </div>
                    )}
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}