const db = require("../db");

exports.searchStores = async (req, res, next) => {
  try {
    const { q } = req.query;
    const values = [];
    let where = "";

    if (q) {
      values.push(`%${q}%`);
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
       ORDER BY s.name ASC`,
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

exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const result = await db.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id`,
      [name, email || null, address, ownerId || null],
    );

    const store = result.rows[0];
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
};
