const express = require("express");

const jwtHelper = require("../../helper/jwt");
const { User } = require("../../models");
const upload = require("../../helper/multer");
const fileLib = require("../../../lib/file");
const logger = require("../../helper/logger");
const { ERROR_TYPES } = require("../../../config/constants");

/**
 * authenticator - check for token and add user to req
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {undefined}
 */
async function authenticator(req, res, next) {
  if ("authorization" in req.headers) {
    // get the bearer and token
    const [bearer, token] = req.headers["authorization"].split(" ");
    if (bearer === "Bearer") {
      if (token) {
        try {
          const payload = await jwtHelper.verify(token);
          const userDetials = await User.findById(payload.userId);
          if (userDetials) {
            req.user = userDetials;
            next();
          } else {
            res.status(401).json({
              errorDetails: "User Not Found",
              errorType: ERROR_TYPES.DB_ERROR,
              message: "Your not Authorization.",
            });
          }
        } catch (error) {
          res.status(401).json({
            errorDetails: error.message || error,
            errorType: ERROR_TYPES.JWT_ERROR,
            message: "Your not Authorization.",
          });
        }
      } else {
        res.status(401).json({
          errorDetails: "please add authentication header with token",
          errorType: ERROR_TYPES.JWT_ERROR,
          message: "Your not Authorization.",
        });
      }
    } else {
      res.status(401).json({
        errorDetails: "please add authentication header with bearer",
        errorType: ERROR_TYPES.JWT_ERROR,
        message: "Your not Authorization.",
      });
    }
  } else {
    res.status(401).json({
      errorDetails: "please add authentication header",
      errorType: ERROR_TYPES.JWT_ERROR,
      message: "Your not Authorization.",
    });
  }
}

const router = express.Router();

/**
 * getFiles - Get files from database to get users
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
async function getFiles(req, res) {
  try {
    const file = await fileLib.getFiles();
    res.status(200).json(file);
    logger.customLog("info", null, "Get File", {});
  } catch (error) {
    res.status(500).json({
      errorType: ERROR_TYPES.DB_ERROR,
      message: "Failed get files.",
      details: error.message || error,
    });
    logger.customLog("error", req, "Failed to get files", {
      errorLocation: "controller.file.getFiles",
      errorType: ERROR_TYPES.DB_ERROR,
      error,
    });
  }
}

/**
 * getFile - Read from fs using id
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
async function getFile(req, res) {
  try {
    const file = await fileLib.getFile(req.params.id);
    file.pipe(res);
    logger.customLog("info", null, "Get File", {});
  } catch (error) {
    res.status(500).json({
      errorType: ERROR_TYPES.DB_ERROR,
      message: "Failed get file.",
      details: error.message || error,
    });
    logger.customLog("error", req, "Failed to get file", {
      errorLocation: "controller.file.getFile",
      errorType: ERROR_TYPES.DB_ERROR,
      error,
    });
  }
}

/**
 * createFile - Create a file in fs and Database
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
async function createFile(req, res) {
  try {
    const file = await fileLib.createFile(req.file, req.user._id);
    res.status(200).json(file);
    logger.customLog("info", null, "Created  File", {});
  } catch (error) {
    res.status(500).json({
      errorType: ERROR_TYPES.DB_ERROR,
      message: "Failed create file.",
      details: error.message || error,
    });
    logger.customLog("error", req, "Failed to create file", {
      errorLocation: "controller.file.createFile",
      errorType: ERROR_TYPES.DB_ERROR,
      error,
    });
  }
}

/**
 * deleteFile - Delete file from database and fs
 *
 * @param {Object} req  the req object contains all the info about request
 * @param {Object} res  the res object contains many methods to respond to request
 * @param {Object} next to pass ther control to next middleware
 *
 * @returns {Undifend}
 */
async function deleteFile(req, res) {
  try {
    await fileLib.deleteFile(req.params.id, req.user._id);
    res.status(200).json({ message: "success" });
    logger.customLog("info", null, "Delete File", {});
  } catch (error) {
    res.status(500).json({
      errorType: ERROR_TYPES.DB_ERROR,
      message: "Failed delete file.",
      details: error.message || error,
    });
    logger.customLog("error", req, "Failed to delete file", {
      errorLocation: "controller.file.deleteFile",
      errorType: ERROR_TYPES.DB_ERROR,
      error,
    });
  }
}

router.get("/", getFiles);
router.get("/:id", getFile);

router.use(authenticator);
router.post("/", upload.single("file"), createFile);
router.delete("/:id", deleteFile);

module.exports = router;
