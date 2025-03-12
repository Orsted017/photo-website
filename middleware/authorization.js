const jwt = require("jsonwebtoken");

exports.authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Исправлено: req.headers, а не req.header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Токен отсутствует или неверный формат");
      return res.status(401).json({ message: "Token mavjud emas yoki noto'g'ri format" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Полученный токен:", token);

    if (!token) {
      return res.status(401).json({ message: "Token mavjud emas" });
    }

    const decoded = jwt.verify(
      token,
      "MEN SENGA BIR SIRNI AYTAMAN, HECH KIM BILMASIN"
    );
    console.log("Декодированный токен:", decoded);
    
    req.user = decoded; // Добавляем данные пользователя в запрос для использования в контроллерах
    next();
  } catch (error) {
    console.log("Ошибка верификации токена:", error.message);
    return res.status(403).json({ message: "Noto'g'ri yoki muddati o'tgan token" });
  }
};