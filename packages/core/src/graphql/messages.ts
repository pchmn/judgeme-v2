export const SUBSCRIBE_MESSAGES = `
  subscription messages {
    messages {
      emoji
      id
      slug
      translations
    }
  }
`;

export const SELECT_MESSAGE_BY_ID = `
  query messages_by_pk($id: uuid!) {
    messages_by_pk(id: $id) {
      emoji
      id
      slug
      translations
    }
  }
`;
