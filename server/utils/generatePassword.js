// utils/generatePassword.js

const crypto = require('crypto');

const generatePassword = () => {
  return crypto.randomBytes(3).toString('hex'); // generates a 12-character hex password
};

module.exports = generatePassword;
