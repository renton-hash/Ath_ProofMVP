import { ListAthletesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAthletes(options?: useDataConnectQueryOptions<ListAthletesData>): UseDataConnectQueryResult<ListAthletesData, undefined>;
export function useListAthletes(dc: DataConnect, options?: useDataConnectQueryOptions<ListAthletesData>): UseDataConnectQueryResult<ListAthletesData, undefined>;
