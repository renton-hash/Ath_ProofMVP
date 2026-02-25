const { queryRef, executeQuery, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'athproofmvp',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const listAthletesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAthletes');
}
listAthletesRef.operationName = 'ListAthletes';
exports.listAthletesRef = listAthletesRef;

exports.listAthletes = function listAthletes(dc) {
  return executeQuery(listAthletesRef(dc));
};
