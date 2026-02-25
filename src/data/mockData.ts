export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  dob: string;
  gender: string;
  school: string;
  lga: string;
  state: string;
  sport: string;
  category: string;
  coach: string;
  coachId: string;
  status: 'Active' | 'Inactive';
  registeredBy: string;
  registeredDate: string;
  speed: number;
  endurance: number;
  strength: number;
  technique: number;
  teamwork: number;
}

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sport: string;
  qualification: string;
  lga: string;
  state: string;
  athletes: number;
  status: 'Active' | 'Inactive';
  registeredBy: string;
  registeredDate: string;
}

export interface Official {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  lga: string;
  state: string;
  status: 'Active' | 'Inactive';
  registeredBy: string;
  registeredDate: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ip: string;
}

export const mockAthletes: Athlete[] = [
{
  id: 'ATH2026-001',
  firstName: 'Adebayo',
  lastName: 'Okonkwo',
  age: 17,
  dob: '2009-03-15',
  gender: 'Male',
  school: 'Ife High School',
  lga: 'Ife Central',
  state: 'Osun',
  sport: 'Football',
  category: 'U-18',
  coach: 'Adewale Ogundimu',
  coachId: 'COA2026-001',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-10',
  speed: 8,
  endurance: 7,
  strength: 8,
  technique: 9,
  teamwork: 8
},
{
  id: 'ATH2026-002',
  firstName: 'Chidinma',
  lastName: 'Eze',
  age: 16,
  dob: '2010-07-22',
  gender: 'Female',
  school: 'OAU Staff School',
  lga: 'Ife North',
  state: 'Osun',
  sport: 'Basketball',
  category: 'U-17',
  coach: 'Funke Adeyemi',
  coachId: 'COA2026-002',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-11',
  speed: 7,
  endurance: 8,
  strength: 6,
  technique: 8,
  teamwork: 9
},
{
  id: 'ATH2026-003',
  firstName: 'Emeka',
  lastName: 'Nwosu',
  age: 19,
  dob: '2007-11-05',
  gender: 'Male',
  school: 'Oduduwa College',
  lga: 'Ife East',
  state: 'Osun',
  sport: 'Tennis',
  category: 'U-20',
  coach: 'Chukwuemeka Obi',
  coachId: 'COA2026-003',
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2026-01-12',
  speed: 9,
  endurance: 8,
  strength: 7,
  technique: 9,
  teamwork: 6
},
{
  id: 'ATH2026-004',
  firstName: 'Fatima',
  lastName: 'Abdullahi',
  age: 15,
  dob: '2011-04-18',
  gender: 'Female',
  school: 'Modakeke High School',
  lga: 'Ife South',
  state: 'Osun',
  sport: 'Volleyball',
  category: 'U-16',
  coach: 'Funke Adeyemi',
  coachId: 'COA2026-002',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-13',
  speed: 7,
  endurance: 7,
  strength: 6,
  technique: 8,
  teamwork: 9
},
{
  id: 'ATH2026-005',
  firstName: 'Oluwaseun',
  lastName: 'Adeleke',
  age: 18,
  dob: '2008-09-30',
  gender: 'Male',
  school: 'Ife Comprehensive High School',
  lga: 'Ife Central',
  state: 'Osun',
  sport: 'Badminton',
  category: 'U-19',
  coach: 'Adewale Ogundimu',
  coachId: 'COA2026-001',
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2026-01-14',
  speed: 9,
  endurance: 8,
  strength: 7,
  technique: 8,
  teamwork: 7
},
{
  id: 'ATH2026-006',
  firstName: 'Blessing',
  lastName: 'Okafor',
  age: 20,
  dob: '2006-02-14',
  gender: 'Female',
  school: 'Federal Polytechnic Ede',
  lga: 'Ede North',
  state: 'Osun',
  sport: 'Football',
  category: 'U-21',
  coach: 'Adewale Ogundimu',
  coachId: 'COA2026-001',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-15',
  speed: 8,
  endurance: 9,
  strength: 7,
  technique: 8,
  teamwork: 9
},
{
  id: 'ATH2026-007',
  firstName: 'Taiwo',
  lastName: 'Adesanya',
  age: 16,
  dob: '2010-06-08',
  gender: 'Male',
  school: 'Ilesa Grammar School',
  lga: 'Ilesa East',
  state: 'Osun',
  sport: 'Basketball',
  category: 'U-17',
  coach: 'Funke Adeyemi',
  coachId: 'COA2026-002',
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2026-01-16',
  speed: 8,
  endurance: 7,
  strength: 8,
  technique: 7,
  teamwork: 8
},
{
  id: 'ATH2026-008',
  firstName: 'Ngozi',
  lastName: 'Obi',
  age: 17,
  dob: '2009-12-20',
  gender: 'Female',
  school: 'Atakumosa High School',
  lga: 'Atakumosa West',
  state: 'Osun',
  sport: 'Tennis',
  category: 'U-18',
  coach: 'Chukwuemeka Obi',
  coachId: 'COA2026-003',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-17',
  speed: 8,
  endurance: 7,
  strength: 6,
  technique: 9,
  teamwork: 7
},
{
  id: 'ATH2026-009',
  firstName: 'Yusuf',
  lastName: 'Bello',
  age: 21,
  dob: '2005-08-11',
  gender: 'Male',
  school: 'Ife-Ife Sports Academy',
  lga: 'Ife Central',
  state: 'Osun',
  sport: 'Baseball',
  category: 'U-22',
  coach: 'Adewale Ogundimu',
  coachId: 'COA2026-001',
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2026-01-18',
  speed: 7,
  endurance: 8,
  strength: 9,
  technique: 8,
  teamwork: 8
},
{
  id: 'ATH2026-010',
  firstName: 'Amaka',
  lastName: 'Igwe',
  age: 15,
  dob: '2011-01-25',
  gender: 'Female',
  school: 'Ejigbo High School',
  lga: 'Ejigbo',
  state: 'Osun',
  sport: 'Volleyball',
  category: 'U-16',
  coach: 'Funke Adeyemi',
  coachId: 'COA2026-002',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-19',
  speed: 6,
  endurance: 7,
  strength: 6,
  technique: 7,
  teamwork: 9
},
{
  id: 'ATH2026-011',
  firstName: 'Chukwudi',
  lastName: 'Nwachukwu',
  age: 18,
  dob: '2008-05-03',
  gender: 'Male',
  school: 'Ife Central High School',
  lga: 'Ife Central',
  state: 'Osun',
  sport: 'Football',
  category: 'U-19',
  coach: 'Adewale Ogundimu',
  coachId: 'COA2026-001',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2026-01-20',
  speed: 9,
  endurance: 8,
  strength: 8,
  technique: 7,
  teamwork: 8
},
{
  id: 'ATH2026-012',
  firstName: 'Aisha',
  lastName: 'Mohammed',
  age: 16,
  dob: '2010-10-17',
  gender: 'Female',
  school: 'Osogbo Girls High School',
  lga: 'Osogbo',
  state: 'Osun',
  sport: 'Badminton',
  category: 'U-17',
  coach: 'Chukwuemeka Obi',
  coachId: 'COA2026-003',
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2026-01-21',
  speed: 8,
  endurance: 8,
  strength: 6,
  technique: 9,
  teamwork: 7
}];


export const mockCoaches: Coach[] = [
{
  id: 'COA2026-001',
  firstName: 'Adewale',
  lastName: 'Ogundimu',
  email: 'adewale.ogundimu@iysdi.org',
  phone: '+234 803 111 2222',
  sport: 'Football',
  qualification: 'UEFA B License',
  lga: 'Ife Central',
  state: 'Osun',
  athletes: 5,
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2025-12-01'
},
{
  id: 'COA2026-002',
  firstName: 'Funke',
  lastName: 'Adeyemi',
  email: 'funke.adeyemi@iysdi.org',
  phone: '+234 805 333 4444',
  sport: 'Basketball',
  qualification: 'FIBA Level 2',
  lga: 'Ife North',
  state: 'Osun',
  athletes: 4,
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2025-12-02'
},
{
  id: 'COA2026-003',
  firstName: 'Chukwuemeka',
  lastName: 'Obi',
  email: 'chukwuemeka.obi@iysdi.org',
  phone: '+234 807 555 6666',
  sport: 'Tennis',
  qualification: 'ITF Level 1',
  lga: 'Ife East',
  state: 'Osun',
  athletes: 3,
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2025-12-03'
},
{
  id: 'COA2026-004',
  firstName: 'Seun',
  lastName: 'Babatunde',
  email: 'seun.babatunde@iysdi.org',
  phone: '+234 809 777 8888',
  sport: 'Volleyball',
  qualification: 'FIVB Level 1',
  lga: 'Ife South',
  state: 'Osun',
  athletes: 3,
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2025-12-04'
}];


export const mockOfficials: Official[] = [
{
  id: 'OFF2026-001',
  firstName: 'Ibrahim',
  lastName: 'Salami',
  role: 'Referee',
  email: 'ibrahim.salami@iysdi.org',
  lga: 'Ife Central',
  state: 'Osun',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2025-12-10'
},
{
  id: 'OFF2026-002',
  firstName: 'Grace',
  lastName: 'Okonkwo',
  role: 'Scout',
  email: 'grace.okonkwo@iysdi.org',
  lga: 'Ife North',
  state: 'Osun',
  status: 'Active',
  registeredBy: 'ADM2026-001',
  registeredDate: '2025-12-11'
},
{
  id: 'OFF2026-003',
  firstName: 'Musa',
  lastName: 'Aliyu',
  role: 'Official',
  email: 'musa.aliyu@iysdi.org',
  lga: 'Osogbo',
  state: 'Osun',
  status: 'Active',
  registeredBy: 'ADM2026-002',
  registeredDate: '2025-12-12'
}];


export const mockAuditLogs: AuditLog[] = [
{
  id: 1,
  timestamp: '2026-02-24 09:15:22',
  userId: 'ADM2026-001',
  userName: 'Admin Tunde',
  action: 'REGISTER_ATHLETE',
  details: 'Registered ATH2026-012 - Aisha Mohammed',
  ip: '197.210.1.45'
},
{
  id: 2,
  timestamp: '2026-02-24 09:32:10',
  userId: 'ADM2026-002',
  userName: 'Admin Kemi',
  action: 'GENERATE_ID',
  details: 'Generated PDF ID for COA2026-004',
  ip: '197.210.1.67'
},
{
  id: 3,
  timestamp: '2026-02-24 10:05:44',
  userId: 'ADM2026-001',
  userName: 'Admin Tunde',
  action: 'UPDATE_ATHLETE',
  details: 'Updated profile for ATH2026-003',
  ip: '197.210.1.45'
},
{
  id: 4,
  timestamp: '2026-02-24 10:18:33',
  userId: 'COA2026-001',
  userName: 'Coach Adewale',
  action: 'UPDATE_METRICS',
  details: 'Updated performance metrics for ATH2026-001',
  ip: '197.210.2.11'
},
{
  id: 5,
  timestamp: '2026-02-24 10:45:19',
  userId: 'ADM2026-001',
  userName: 'Admin Tunde',
  action: 'UPLOAD_MEDIA',
  details: 'Uploaded 5 photos to gallery',
  ip: '197.210.1.45'
},
{
  id: 6,
  timestamp: '2026-02-24 11:02:55',
  userId: 'ADM2026-002',
  userName: 'Admin Kemi',
  action: 'REGISTER_COACH',
  details: 'Registered COA2026-004 - Seun Babatunde',
  ip: '197.210.1.67'
},
{
  id: 7,
  timestamp: '2026-02-24 11:30:08',
  userId: 'SADM001',
  userName: 'Super Admin',
  action: 'CREATE_ADMIN',
  details: 'Created admin account ADM2026-003',
  ip: '197.210.0.1'
},
{
  id: 8,
  timestamp: '2026-02-24 12:15:44',
  userId: 'ADM2026-001',
  userName: 'Admin Tunde',
  action: 'EXPORT_REPORT',
  details: 'Exported registration report (CSV)',
  ip: '197.210.1.45'
},
{
  id: 9,
  timestamp: '2026-02-24 13:00:22',
  userId: 'OFF2026-002',
  userName: 'Scout Grace',
  action: 'VIEW_PROFILE',
  details: 'Viewed profile of ATH2026-005',
  ip: '197.210.3.22'
},
{
  id: 10,
  timestamp: '2026-02-24 13:45:11',
  userId: 'ADM2026-002',
  userName: 'Admin Kemi',
  action: 'UPDATE_EVENT',
  details: 'Updated Basketball schedule for Feb 26',
  ip: '197.210.1.67'
}];


export const eventSchedule = [
{
  date: 'Feb 25, 2026',
  day: 'Day 1',
  time: '08:00 AM',
  sport: 'Opening Ceremony',
  category: 'All',
  venue: 'Main Arena',
  status: 'Scheduled'
},
{
  date: 'Feb 25, 2026',
  day: 'Day 1',
  time: '10:00 AM',
  sport: 'Football',
  category: 'U-18',
  venue: 'Field A',
  status: 'Scheduled'
},
{
  date: 'Feb 25, 2026',
  day: 'Day 1',
  time: '02:00 PM',
  sport: 'Basketball',
  category: 'U-17',
  venue: 'Court 1',
  status: 'Scheduled'
},
{
  date: 'Feb 25, 2026',
  day: 'Day 1',
  time: '04:00 PM',
  sport: 'Tennis',
  category: 'U-20',
  venue: 'Tennis Court',
  status: 'Scheduled'
},
{
  date: 'Feb 26, 2026',
  day: 'Day 2',
  time: '09:00 AM',
  sport: 'Volleyball',
  category: 'U-16',
  venue: 'Court 2',
  status: 'Scheduled'
},
{
  date: 'Feb 26, 2026',
  day: 'Day 2',
  time: '11:00 AM',
  sport: 'Badminton',
  category: 'U-19',
  venue: 'Indoor Hall',
  status: 'Scheduled'
},
{
  date: 'Feb 26, 2026',
  day: 'Day 2',
  time: '03:00 PM',
  sport: 'Baseball',
  category: 'U-22',
  venue: 'Field B',
  status: 'Scheduled'
},
{
  date: 'Feb 27, 2026',
  day: 'Day 3',
  time: '09:00 AM',
  sport: 'Football',
  category: 'U-21',
  venue: 'Field A',
  status: 'Scheduled'
},
{
  date: 'Feb 27, 2026',
  day: 'Day 3',
  time: '01:00 PM',
  sport: 'Basketball',
  category: 'U-19',
  venue: 'Court 1',
  status: 'Scheduled'
},
{
  date: 'Feb 27, 2026',
  day: 'Day 3',
  time: '04:00 PM',
  sport: 'Tennis',
  category: 'U-18',
  venue: 'Tennis Court',
  status: 'Scheduled'
},
{
  date: 'Feb 28, 2026',
  day: 'Day 4',
  time: '10:00 AM',
  sport: 'Finals - All Sports',
  category: 'All',
  venue: 'Main Arena',
  status: 'Scheduled'
},
{
  date: 'Feb 28, 2026',
  day: 'Day 4',
  time: '05:00 PM',
  sport: 'Closing Ceremony & Awards',
  category: 'All',
  venue: 'Main Arena',
  status: 'Scheduled'
}];