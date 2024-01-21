import {randomBytes} from 'crypto';

export function createCSRFToken() {
  return randomBytes(100).toString('base64');
}
