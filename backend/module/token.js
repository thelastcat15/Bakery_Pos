const crypto = require('crypto');

function generateSecret(length) {
  return crypto.randomBytes(length).toString('base64url');
}

console.log('JWT_SECRET=' + generateSecret(30));
