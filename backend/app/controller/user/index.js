/**
 * file contains all the routes realated to user authentication
 * any route registed here would be {/api/user/route}
 * */

const express = require("express");
const userLib = require("../../../lib/user");
const logger = require("../../helper/logger");
const { ERROR_TYPES } = require("../../../config/constants");

const router = express.Router();

/**
 * login - The Signup or register the user and create or update it in the db
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
async function login(req, res, next) {
  const userObj = req.body;
  try {
    const token = await userLib.createUser(userObj);
    res.status(200).json({ token });
    logger.customLog("info", null, "Created user", {
      userEmail: userObj.email,
    });
  } catch (error) {
    res.status(500).json({
      errorType: ERROR_TYPES.DB_ERROR,
      message: "Failed to register you.",
      details: error.message || error,
    });
    logger.customLog("error", req, "Failed to create user", {
      ...userObj,
      errorLocation: "controller.user.signUp",
      errorType: ERROR_TYPES.DB_ERROR,
      error,
    });
  }
}

/**
 * signin - The Signin the user and genearte token for the app
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
async function signIn(req, res, next) {
  const passwordAndMail = req.body;
  try {
    const token = await userLib.getUserToken(passwordAndMail);
    res.status(200).json({ token });
    logger.customLog("info", null, "Created token for the user", {
      userEmail: passwordAndMail.email,
    });
  } catch (error) {
    res.status(401).json({
      errorType: ERROR_TYPES.DB_ERROR,
      message: "Invalid Email or Password",
      errorDetails: error.message || error,
    });
    logger.customLog("error", req, "Failed to authenticate user", {
      errorLocation: "controller.user.signIn",
      errorType: ERROR_TYPES.DB_ERROR,
      errorDetails: error.message || error,
    });
  }
}

router.post("/register", login);
router.post("/signin", signIn);
module.exports = router;
