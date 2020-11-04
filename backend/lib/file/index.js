const { func } = require("joi");
const fs = require("fs");
const { File } = require("../../app/models");
const { Mongoose, Types } = require("mongoose");

/**
 * create file documents in mongoose
 * @param {String} file path to the file upload folder
 * @param {String} owner id of the user(owner of the file)
 */
async function createFile(file, owner) {
  const newFile = await new File({
    path: file.path,
    name: file.originalname,
    owner: owner,
    mimetype: file.mimetype,
  }).save();
  return newFile;
}

/**
 * get all the file documents in mongodb
 */
async function getFiles() {
  return await File.find({}, { path: 0, owner: 0 });
}

/**
 * get stream for the file
 * @param {string} id id of the file
 */
async function getFile(id) {
  const file = await File.findById(id);

  return fs.createReadStream(file.path);
}

/**
 * delete file documents in mongoose
 * @param {String} file path to the file upload folder
 * @param {String} owner id of the user(owner of the file)
 */
async function deleteFile(id, owner) {
  const file = await File.findOne({ _id: id, owner });
  if (!file) throw new Error("file not found");
  await file.remove();
  return fs.promises.unlink(file.path);
}

module.exports = { createFile, getFiles, getFile, deleteFile };
