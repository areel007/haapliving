const { JWT_TTL, ONE, PAGINATION } = require("./app.constant.js");

// import { JWT_TTL, ONE, PAGINATION } from "./app.constant.js";

module.exports = function generateToken() {
  const SACK = "1234567890";
  const SACK_LENGTH = SACK.length;
  const TOKEN_LENGTH = 5;

  let token = "";

  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += SACK[Math.floor(Math.random() * SACK_LENGTH)];
  }

  return token;
};

module.exports = function isValidRoomNumber(roomNumber = "") {
  // A room number will be five characters starting with
  // 'R' followed by the floor number and the room number
  if (!roomNumber) return false;

  const roomNumberLength = roomNumber.length;

  if (roomNumberLength !== 5) return false;

  if (!roomNumber.startsWith("R")) return false;

  return !isNaN(Number(roomNumber.substring(1, roomNumberLength)));
};

module.exports = function isValidPrice(price = 0) {
  return price && !isNaN(Number(price));
};

module.exports = async function isAuthenticUser(model, payload = {}) {
  return await model.findOne({
    id: payload.id,
    username: payload.username,
    email: payload.email,
  });
};

module.exports = function pagination(page = 1, pageSize = 12) {
  if (page < ONE) {
    page = PAGINATION.page;
  }

  if (pageSize < ONE) {
    pageSize = PAGINATION.pageSize;
  }

  let offset = (page - ONE) * pageSize;
  let limit = pageSize;

  return { limit, skip: offset };
};

module.exports = function getJwtIat() {
  return Date.now() + JWT_TTL;
};

module.exports = function getTokenFromHeader(req) {
  const headerAuth = req.headers["authorization"];

  if (!headerAuth) {
    return "";
  }

  return headerAuth.split(" ")[1];
};
