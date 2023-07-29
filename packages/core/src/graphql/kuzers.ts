export const INSERT_KUZER_MUTATION = `
  mutation insert_kuzers_one($id: uuid!, $status: String!) {
    insert_kuzers_one(object: { id: $id, status: $status }) {
      id
      status
    }
  }
`;

export const UPDATE_KUZER_MUTATION = `
  mutation update_kuzers_by_pk($id: uuid!, $data: kuzers_set_input!) {
    update_kuzers_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`;

export const SEARCH_NEARBY_KUZERS = `
 subscription search_nearby_kuzers($minLat: float8!, $minLong: float8!, $maxLat: float8!, $maxLong: float8!) {
  search_nearby_kuzers(args: {min_lat: $minLat, min_long: $minLong, max_lat: $maxLat, max_long: $maxLong}) {
    id
    name
    geopoint
    status
    messageStatistics
    lastOnline
    createdAt
    updatedAt
  }
 }
`;

export const QUERY_KUZERS = `
 query kuzers {
  kuzers {
    id
    geopoint
    status
    messageStatistics
    createdAt
    updatedAt
  }
 }
`;
