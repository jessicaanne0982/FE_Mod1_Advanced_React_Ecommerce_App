import { config } from 'dotenv';

// Loads environment variables from .env.test when running in a test environment
config({ path: '.env.test' });

import { TextEncoder, TextDecoder } from 'util';

// Ensures TextEncoder is available globally
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// Ensures TextDecoder is available globally
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
