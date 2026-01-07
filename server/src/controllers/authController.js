const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config();

const toAuthUser = (row, roles) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  roles,
});

const issueToken = (userId, roles) =>
  jwt.sign({ sub: userId, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userResult = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash],
    );
    const user = userResult.rows[0];

    const roleRes = await db.query("SELECT id FROM roles WHERE name = 'user'");
    const roleId = roleRes.rows[0].id;
    await db.query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [user.id, roleId]);

    const roles = ["user"];
    const token = issueToken(user.id, roles);

    return res.status(201).json({ token, user: toAuthUser(user, roles) });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email],
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const rolesRes = await db.query(
      `SELECT r.name
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id],
    );
    const roles = rolesRes.rows.map((r) => r.name);

    const token = issueToken(user.id, roles);

    return res.json({ token, user: toAuthUser(user, roles) });
  } catch (err) {
    return next(err);
  }
};
