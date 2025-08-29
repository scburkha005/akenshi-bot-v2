export function requireUser (req, res, next) {
  if (!req.user) {
    next({
      error: "Missing User",
      reason: "You must be logged in to perform this action"
    });
  }
  next();
}