const { User } = require("../../app/models");
const Joi = require("joi");
const jwtHelper = require("../../app/helper/jwt");
const userHelper = require("../../app/helper/user");

const userObjectSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }),
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

/**
 * createUser - create the user in database
 *
 * @param {Object} userObject the details of the user
 * @param {Function} callback the function envoked with two parameters
 *                            1. error the error while saving in db or missing details
 *                            2. token if the save is successfull the user is signed in
 *
 * @returns {undefined}
 */
async function createUser(userObject) {
  const { error, value } = Joi.validate(userObject, userObjectSchema);
  if (error) throw error;
  const existingUser = await User.findOne({ email: userObject.email });
  if (existingUser) {
    throw new Error("User Exists with given email");
  }
  const passwordHash = await userHelper.createPasswordHash(userObject.password);
  const newUser = await new User({
    email: userObject.email,
    name: userObject.email,
    salt: passwordHash.salt,
    hash: passwordHash.hash,
  }).save();
  const token = await jwtHelper.sign({ userId: newUser._id });
  return token;
}
const passwordAndMailSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

/**
 * getUserToken - create a signin toke for the user
 *
 * @param {Object} passwordAndMail the password and email
 * @param {Function} callback        the function is envoked with error and token
 *                               1. error the error while creating access_token
 *                               2. token the signin token.
 * @returns {undefined}
 */
async function getUserToken(passwordAndMail) {
  const { error, value } = Joi.validate(passwordAndMail, passwordAndMailSchema);
  if (error) throw error;
  const userDetials = await User.findOne({ email: passwordAndMail.email });
  if (userDetials) {
    const isMatch = await userHelper.checkHashPassword(
      passwordAndMail.password,
      userDetials.salt,
      userDetials.hash
    );
    if (isMatch) {
      const token = await jwtHelper.sign({
        userId: userDetials._id,
      });
      return token;
    } else {
      throw Error("Email/Password does not match");
    }
  } else {
    throw Error("Email/Password does not match");
  }
}

module.exports = { createUser, getUserToken };
