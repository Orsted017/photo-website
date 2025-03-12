const pool = require("../config/db");

exports.getLikes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM likes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении всех лайков:", error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
exports.addLikes = async (req, res) => {
  try {
    const { userId, photoId } = req.body;

    if (!userId || !photoId) {
      return res.status(400).json({ message: "userId и photoId обязательны" });
    }

    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const photoCheck = await pool.query("SELECT * FROM photos WHERE id = $1", [
      photoId,
    ]);
    if (photoCheck.rows.length === 0) {
      return res.status(404).json({ message: "Фото не найдено" });
    }

    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE userId = $1 AND photoId = $2",
      [userId, photoId]
    );
    if (existingLike.rows.length > 0) {
      return res.status(400).json({ message: "Вы уже лайкнули это фото" });
    }

    const result = await pool.query(
      "INSERT INTO likes (userId, photoId) VALUES ($1, $2) RETURNING *",
      [userId, photoId]
    );

    res.status(201).json({
      message: "Лайк успешно добавлен",
      like: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при добавлении лайка:", error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
exports.deleteLikes = async (req, res) => {
  try {
    const { userId, photoId } = req.body;

    if (!userId || !photoId) {
      return res.status(400).json({ message: "userId и photoId обязательны" });
    }

    const result = await pool.query(
      "DELETE FROM likes WHERE userId = $1 AND photoId = $2 RETURNING *",
      [userId, photoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Лайк не найден" });
    }

    res.status(200).json({ message: "Лайк успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении лайка:", error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
exports.getLikesForPhotoId = async (req, res) => {
  try {
    const { photoId } = req.params;

    const result = await pool.query("SELECT * FROM likes WHERE photoId = $1", [
      photoId,
    ]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении лайков:", error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
exports.getLikesCount = async (req, res) => {
  try {
    const { photoId } = req.params;

    const result = await pool.query(
      "SELECT COUNT(*) as count FROM likes WHERE photoId = $1",
      [photoId]
    );

    res.status(200).json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Ошибка при подсчёте лайков:", error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
