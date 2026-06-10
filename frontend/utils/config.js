// API Configuration
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://speakify-backend-okax.onrender.com';
// export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://speakify-backend-okax.onrender.com';

export const API_BASE_URL = 'http://localhost:3456';
export const SOCKET_URL = 'http://localhost:3456';


// API Endpoints
export const ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  CHAT: '/chat',
  ROOMS: '/rooms',
  MESSAGE: '/message',
  REQUEST: '/request',
  UPLOADIMAGE:'/uploadimage',
  UPLOADFILE:'/uploadfile'
};

// Socket Events
export const SOCKET_EVENTS = {
  // Emit (client -> server)
  JOIN_CHAT_ROOM: 'join-chat-room',
  SEND_MESSAGE: 'sendmessage',
  SEND_REQUEST: 'sendrequest',
  CREATE_ROOM: 'createroom',
  JOIN_ROOM: 'joinroom',
  FIND_USER: 'finduser',
  FIND_FRIEND: 'findfriend',
  CREATE_ROOM_WITH_FRIEND: 'createroomwiththefriend',
  SEARCH_GROUP: 'searchgroup',
  DELETE_MESSAGE: 'delete-message',
  DELETE_MESSAGE_RESPONSE:'delete-message-response',
  DELETED_MESSAGE_RESPONSE:'deleted-message-response',
  UPDATE_CHATROOM:'update-chatroom',

  // Listen (server -> client)
  MESSAGE_STORAGE: 'messagestorage',
  SEARCH_GROUP_RESPONSE: 'searchgroup-response',
  SEND_REQUEST_RESPONSE: 'sendrequest-response',
  ROOM_CREATED: 'roomcreated',
  JOIN_ROOM_RESPONSE: 'joinroom-response',
  USER_ID: 'userid',
  FRIEND_FOUND: 'friendfinded',
  ROOM_CREATED_WITH_FRIEND: 'roomcreatedwithfriend',
  ERROR: 'error',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'chatapp_token',
  USER: 'chatapp_user',
};

// Auth Config
export const AUTH = {
  TOKEN_EXPIRY_MS: 15 * 60 * 1000, // 15 minutes
  STORAGE_PREFIX: 'chatapp_',
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  ENDPOINTS,
  SOCKET_EVENTS,
  STORAGE_KEYS,
  AUTH,
};
