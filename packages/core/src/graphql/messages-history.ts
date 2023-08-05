export const SELECT_MESSAGES_RECEIVED = `
  query messages_history($id: uuid!) {
    messages_history(where: {toId: {_eq: $id}}, order_by: {sentAt: desc}) {
      createdAt
      distance
      id
      message {
        emoji
        id
        slug
        translations
      }
      updatedAt
      sentAt
    }
  }
`;

export const SELECT_MESSAGES_SENT = `
  query messages_history($id: uuid!) {
    messages_history(where: {fromId: {_eq: $id}}, order_by: {sentAt: desc}) {
      createdAt
      distance
      id
      message {
        emoji
        id
        slug
        translations
      }
      updatedAt
      sentAt
    }
  }
`;

export const INSERT_MESSAGE_HISTORY = `
  mutation insert_messages_history_one($data: messages_history_insert_input!) {
    insert_messages_history_one(object: $data) {
      id
    }
  }
`;
