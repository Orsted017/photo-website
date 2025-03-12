const express = require("express");
const {
  getPhotos,
  getPhotosId,
  deletePhoto,
  addPhoto,
} = require("../controllers/photoController");
const { authorization } = require("../middleware/authorization");
const uploadMiddleware = require("../middleware/uploadMiddleWare");
const photoRouter = express.Router();

photoRouter.get("/photos", authorization, getPhotos); // Получение всех фото
photoRouter.get("/photos/:id", authorization, getPhotosId); // Получение фото по userId
photoRouter.delete("/photos/:id", authorization, deletePhoto); // Удаление фото
photoRouter.post("/photos", authorization, uploadMiddleware, addPhoto); // Добавление фото

module.exports = photoRouter;