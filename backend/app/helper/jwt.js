const jwt = require("jsonwebtoken");
const config = require("../../config")();

module.exports = {
  /**
   * sign - create a jwt from payload.
   *
   * @param {Object} payload  the payload send to the user
   * @returns {Promise}
   */
  sign(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { ...payload, exp: Date.now() + config.JWT.EXPIRATION_TIME },
        config.JWT.SECERET,
        { algorithm: config.JWT.ALGORITHM },
        function (errorInSign, token) {
          if (errorInSign) {
            reject(errorInSign.message);
          } else {
            resolve(token);
          }
        }
      );
    });
  },

  /**
   * verify - check the token signature.
   *
   * @param {String} token    the token for verification
   * @param {Function} callback function envoked on completion of the task with
   *                        1. error the error in verification
   *                        2. if verification is successfull the decoded data is passed.
   * @returns {Promise}
   */
  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT.SECERET, function (
        errorInVerfication,
        decodedData
      ) {
        if (errorInVerfication) {
          reject(errorInVerfication.message);
        } else {
          resolve(decodedData);
        }
      });
    });
  },
};
