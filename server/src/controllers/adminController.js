const db = require("../db");

exports.getMetrics = async (req, res, next) => {
  try {
    const [{ rows: users }, { rows: stores }, { rows: ratings }] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS count FROM users"),
      db.query("SELECT COUNT(*)::int AS count FROM stores"),
      db.query("SELECT COUNT(*)::int AS count FROM ratings"),
    ]);

    res.json({
      totalUsers: users[0].count,
      totalStores: stores[0].count,
      totalRatings: ratings[0].count,
    });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const values = [];
    let where = "";

    if (search) {
      values.push(`%${search}%`);
      where = "WHERE u.name ILIKE $1 OR u.email ILIKE $1";
    }

    const result = await db.query(
      `SELECT u.id, u.name, u.email,
              COALESCE(string_agg(r.name, ',' ORDER BY r.name), '') AS roles
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       ${where}
       GROUP BY u.id
       ORDER BY u.name ASC`,
      values,
    );

    const users = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      roles: row.roles ? row.roles.split(",") : [],
    }));

    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.listStores = async (req, res, next) => {
  try {
    const { search } = req.query;
    const values = [];
    let where = "";

    if (search) {
      values.push(`%${search}%`);
      where = "WHERE s.name ILIKE $1 OR s.address ILIKE $1";
    }

    const result = await db.query(
      `SELECT s.id,
              s.name,
              s.email,
              s.address,
              AVG(r.rating)::numeric(3,2) AS average_rating,
              COUNT(r.id)::int AS ratings_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${where}
       GROUP BY s.id
       ORDER BY average_rating DESC NULLS LAST, s.name ASC`,
      values,
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        address: row.address,
        averageRating: row.average_rating ? Number(row.average_rating) : null,
        ratingsCount: row.ratings_count,
      })),
    );
  } catch (err) {
    next(err);
  }
};
