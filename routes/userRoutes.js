const express = require("express");
const {login, signup, getUsers, getUsersId, deleteUser, updateUsers} = require("../controllers/userController")
const userRouter = express.Router()


userRouter.get("/users", getUsers );
userRouter.get("/users/:id", getUsersId );
userRouter.post("/signup", signup );
userRouter.post("/login", login );
userRouter.delete("/users/:id", deleteUser );
userRouter.put("/users/:id", updateUsers );

module.exports = userRouter