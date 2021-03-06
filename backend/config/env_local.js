module.exports = {
  MONGO_DB: {
    URI: process.env.MONGODB_URI,
  },

  CHECK_TIME: process.env.CHECK_TIME || 900000,
  PORT: process.env.PORT || 4000,
  JWT: {
    SECERET:
      process.env.SECERET ||
      "69e75517c4e95ee7a3f6da907e939f4900ea2a02a00e6f660477e2993277693d5b8ee27f46d0862444be2a1b8a40cb",
    EXPIRATION_TIME: process.env.EXPIRATION_TIME || 1000 * 60 * 60 * 24 * 3, // three days
    ALGORITHM: process.env.ALGORITHM || "HS256",
  },
};
