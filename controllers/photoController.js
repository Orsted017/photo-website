const pool = require("../config/db");
const jwt = require("jsonwebtoken");

exports.getPhotos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM photos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении фото:", error.message);
    res.status(500).send("В баре вышли проблемы");
  }
};

exports.getPhotosId = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const resultUser = await pool.query(
        "SELECT * FROM photos WHERE userId = $1",
        [id]
      );
      return res.status(200).json(resultUser.rows);
    }

    const result = await pool.query("SELECT * FROM photos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении фото:", error.message);
    res.status(500).send("В баре вышли проблемы");
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM photos WHERE id = $1", [id]);
    res.status(200).json({
      message: "Rasm o'chirildi",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("В баре вышли проблемы");
  }
};

exports.addPhoto = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const { userId, title, description } = req.body;
  const filepath = req.file ? `/uploads/${req.file.filename}` : null;

  console.log("Извлеченные данные:", { userId, filepath, title, description });

  if (!userId || !filepath || !title || !description) {
    console.error("Отсутствуют обязательные поля:", { userId, filepath, title, description });
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO photos (userId, filepath, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, filepath, title, description]
    );
    console.log("Результат запроса к БД:", result.rows[0]);
    res.status(201).json({ message: "Фото добавлено", photo: result.rows[0] });
  } catch (err) {
    console.error("Ошибка при добавлении фото:", err.message, err.stack);
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
};