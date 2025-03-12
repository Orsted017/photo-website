const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Сохранение файла в:", path.join(__dirname, "../uploads"));
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const safeFileName = Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    console.log("Сохраняемое имя файла:", safeFileName);
    cb(null, safeFileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Лимит 10MB
}).single("photo");

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Ошибка в multer:", err.message);
      return res.status(400).json({ message: "Ошибка загрузки файла", error: err.message });
    }
    if (!req.file) {
      console.error("Файл не был передан с фронтенда");
      return res.status(400).json({ message: "Файл не был передан" });
    }
    console.log("Файл успешно загружен:", req.file);
    next();
  });
};

module.exports = uploadMiddleware;