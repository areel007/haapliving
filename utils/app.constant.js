// import dotenv from "dotenv";
// dotenv.config();

exports.rounds = parseInt(process.env.SALT_ROUNDS) || 10;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.port = process.env.PORT || 3000;
exports.MINIMUM_PASSWORD_SIZE = 6;
exports.ONE = 1;
// set to one week if the JWT_TTL is not set. This is is microseconds
exports.JWT_TTL = parseInt(process.env.JWT_TTL) || 1000 * 60 * 60 * 24 * 7;
exports.PAGINATION = { page: 1, pageSize: 12 };
exports.REDIS_URI = process.env.REDIS_URI;
// set to one hour if the REDIS_TTL is not set. This is in seconds
exports.REDIS_TTL = parseInt(process.env.REDIS_TTL) || 60 * 60;
