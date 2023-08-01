export const INSERT_KUZER_MUTATION = `
  mutation insert_kuzers_one($data: kuzers_insert_input!) {
    insert_kuzers_one(object: $data, on_conflict: { constraint: kuzers_pkey, update_columns: [status] }) {
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

export const SEARCH_VISIBLE_KUZERS = `
 subscription search_visible_kuzers($minLat: float8!, $minLong: float8!, $maxLat: float8!, $maxLong: float8!) {
  search_visible_kuzers(args: {min_lat: $minLat, min_long: $minLong, max_lat: $maxLat, max_long: $maxLong}) {
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

export const SELECT_KUZER_BY_ID = `
 query kuzers_by_pk($id: uuid!) {
  kuzers_by_pk(id: $id) {
    id
    geopoint
    status
    messageStatistics
    installations {
      pushToken
      deviceLocale
    }
    createdAt
    updatedAt
  }
 }
`;
