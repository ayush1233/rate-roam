const db = require("../db");

exports.upsertRating = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = EXCLUDED.rating, updated_at = now()
       RETURNING id, user_id, store_id, rating, created_at, updated_at`,
      [userId, storeId, rating],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getUserSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [statsRes, listRes] = await Promise.all([
      db.query(
        `SELECT COUNT(*)::int AS rated_stores,
                AVG(rating)::numeric(3,2) AS avg_rating
         FROM ratings
         WHERE user_id = $1`,
        [userId],
      ),
      db.query(
        `SELECT r.id,
                r.rating,
                r.created_at,
                s.name AS store_name
         FROM ratings r
         JOIN stores s ON s.id = r.store_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC
         LIMIT 10`,
        [userId],
      ),
    ]);

    const stats = statsRes.rows[0];

    res.json({
      summary: {
        ratedStores: stats.rated_stores,
        averageRating: stats.avg_rating ? Number(stats.avg_rating) : null,
        pendingReviews: 0,
      },
      ratings: listRes.rows,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOwnerSummary = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const [statsRes, listRes] = await Promise.all([
      db.query(
        `SELECT AVG(r.rating)::numeric(3,2) AS avg_rating,
                COUNT(r.id)::int AS total_reviews,
                COUNT(DISTINCT r.user_id)::int AS unique_reviewers
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1`,
        [ownerId],
      ),
      db.query(
        `SELECT r.id,
                r.rating,
                r.created_at,
                u.name AS user_name,
                s.name AS store_name
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         LEFT JOIN users u ON u.id = r.user_id
         WHERE s.owner_id = $1
         ORDER BY r.created_at DESC
         LIMIT 20`,
        [ownerId],
      ),
    ]);

    const stats = statsRes.rows[0];

    res.json({
      summary: {
        averageRating: stats.avg_rating ? Number(stats.avg_rating) : null,
        totalReviews: stats.total_reviews,
        uniqueReviewers: stats.unique_reviewers,
      },
      reviewers: listRes.rows,
    });
  } catch (err) {
    next(err);
  }
};
