export function requireUser (req, res, next) {
  if (!req.user) {
    next({
      name: "Missing User",
      message: "You must be logged in to perform this action"
    });
  }
  next();
}

export function requireAdminUser (req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    next({
      name: "Invalid User",
      message: "You must be an admin user to perform this action"
    });
  }
  next();
}