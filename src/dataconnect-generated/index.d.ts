import { ConnectorConfig, DataConnect, QueryRef, QueryPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Athlete_Key {
  id: UUIDString;
  __typename?: 'Athlete_Key';
}

export interface Injury_Key {
  id: UUIDString;
  __typename?: 'Injury_Key';
}

export interface ListAthletesData {
  athletes: ({
    id: UUIDString;
    firstName: string;
    lastName: string;
    sport?: string | null;
    position?: string | null;
    gender: string;
    dateOfBirth: DateString;
    contactNumber?: string | null;
    emergencyContact?: string | null;
    user?: {
      id: UUIDString;
      email: string;
    } & User_Key;
      coach?: {
        id: UUIDString;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
      } & User_Key;
  } & Athlete_Key)[];
}

export interface PerformanceMetric_Key {
  id: UUIDString;
  __typename?: 'PerformanceMetric_Key';
}

export interface TrainingProgram_Key {
  id: UUIDString;
  __typename?: 'TrainingProgram_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Workout_Key {
  id: UUIDString;
  __typename?: 'Workout_Key';
}

interface ListAthletesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAthletesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAthletesData, undefined>;
  operationName: string;
}
export const listAthletesRef: ListAthletesRef;

export function listAthletes(): QueryPromise<ListAthletesData, undefined>;
export function listAthletes(dc: DataConnect): QueryPromise<ListAthletesData, undefined>;

