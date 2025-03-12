const pool = require("../config/db");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("select * from users");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Serverda hatolik yuz berdi");
  }
};

exports.getUsersId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const result = await pool.query("select * from users where id = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Serverda hatolik yuz berdi");
  }
};

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, username, password, avatar } = req.body;

    const userCheck = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message:
          "Ushbu username allaqachon band. Iltimos, boshqa username tanlang.",
      });
    }

    // Parolni shifrlash
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    console.log(salt);
    console.log(encryptedPassword);
    
    // Foydalanuvchini bazaga yozish
    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, username, password, avatar) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstname, lastname, username, encryptedPassword, avatar] // Bu yerda encryptedPassword ishlatiladi
    );

    res.status(201).json({
      message: "Yangi Ichimlikdosh qo‘shildi",
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Girgitoningizda nomaqbul nuqson yuzaga keldi");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Username yoki parol noto'g'ri" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Username yoki parol noto'g'ri" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "MEN SENGA BIR SIRNI AYTAMAN, HECH KIM BILMASIN",
      { expiresIn: "10m" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Girgitoningizda nomaqbul nuqson yuzaga keldi");
  }
};



exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || id === "null") {
    return res.status(400).json({ message: "Некорректный ID пользователя" });
  }

  try {
    await pool.query("DELETE FROM photos WHERE userid = $1", [id]);
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ message: "Пользователь удален" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, username, password, avatar } = req.body;

    // Проверяем, есть ли уже такой username у другого пользователя
    const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    // if (existingUser.rows.length > 0) {
    //   return res.status(400).json({ message: "Username already exists!" });
    // }

    // Обновляем данные пользователя
    const user = await pool.query(
      "UPDATE users SET firstname = $1, lastname = $2, username = $3, password = $4, avatar = $5 WHERE id = $6 returning *",
      [firstname, lastname, username, password, avatar, id]
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully!", user: user.rows[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Server error");
  }
};
