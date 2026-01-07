const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  const hasRole = req.user.roles.some((r) => roles.includes(r));
  if (!hasRole) return res.status(403).json({ message: "Forbidden" });
  return next();
};

module.exports = { requireRole };
