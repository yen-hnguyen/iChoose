//function that generates a random string for IDS
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};

module.exports = { generateRandomString };