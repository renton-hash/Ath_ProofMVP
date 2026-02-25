export type Role =
  | 'super-admin'
  | 'admin'
  | 'coach'
  | 'official'
  | 'scout'
  | 'athlete'
  | 'volunteer'

export interface User {
  id: string
  name: string
  role: Role
  email?: string
  avatar?: string
  code?: string
}

export interface Athlete {
  id: string // ATH2026-NNN
  firstName: string
  lastName: string
  age: number // 11-15 years
  dob?: string
  gender: 'Male' | 'Female'
  sport: string
  school: string
  lga: string
  state: string
  category: string
  // --- ADD THESE MISSING FIELDS ---
  status: 'Active' | 'Inactive' | 'Pending'
  registeredBy: string
  registeredDate: string
  email?: string
  phone?: string
  stats?: {
    speed: number
    endurance: number
    strength: number
    technique: number
    teamwork: number
  }
}