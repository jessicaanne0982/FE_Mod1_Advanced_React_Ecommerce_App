// jest.envSetup.js
import { config } from 'dotenv';

// This loads .env.test by default when NODE_ENV=test
config({ path: '.env.test' });

import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
