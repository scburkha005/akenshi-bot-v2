export function requireUser (req, res, next) {
  if (!req.user) {
    next({
      error: "Missing User",
      reason: "You must be logged in to perform this action"
    });
  }
  next();
}

export function requireAdminUser (req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    next({
      error: "Invalid User",
      reason: "You must be an admin user to perform this action"
    });
  }
  next();
}