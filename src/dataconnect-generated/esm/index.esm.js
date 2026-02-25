import { queryRef, executeQuery, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'athproofmvp',
  location: 'us-east4'
};

export const listAthletesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAthletes');
}
listAthletesRef.operationName = 'ListAthletes';

export function listAthletes(dc) {
  return executeQuery(listAthletesRef(dc));
}

