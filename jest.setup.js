// jest.setup.js

require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');
const dotenv = require('dotenv');
const path = require('path');

// Set global TextEncoder/TextDecoder 
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set environment to 'test'
process.env.NODE_ENV = 'test';

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

// Mock import.meta for Jest to simulate Vite's behavior
global.import = {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: 'test-firebase-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
      VITE_FIREBASE_PROJECT_ID: 'test-project-id',
      VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-messaging-sender-id',
      VITE_FIREBASE_APP_ID: 'test-app-id',
    },
  },
};

