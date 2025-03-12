const express = require("express");
const {getLikes, addLikes, deleteLikes, getLikesForPhotoId, getLikesCount} = require('../controllers/likeController');
const likeRouter = express.Router()


likeRouter.get("/likes", getLikes);
likeRouter.post("/likes", addLikes);
likeRouter.delete("/likes", deleteLikes);
likeRouter.get("/likes/:photoId", getLikesForPhotoId);
likeRouter.get("/likes/count/:photoId", getLikesCount);


module.exports = likeRouter