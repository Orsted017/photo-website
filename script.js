const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path"); // Добавляем для работы с путями

const pool = require("./config/db");

const userRouter = require("./routes/userRoutes");
const photoRouter = require("./routes/photoRoutes");
const likeRouter = require("./routes/likeRoutes");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// USERS API
app.use("/", userRouter);

// PHOTOS API
app.use("/", photoRouter);

// LIKES API
app.use("/", likeRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi`);
});