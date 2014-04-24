/**
* Only allow owners or admins to pass through
*/
var _ = require('underscore');

module.exports = function addUserId (req, res, next) {
  // check if owner of the project or task
  if (req.isOwner || req.user[0].isAdmin) {
    return next();
  }
  // if this isn't a project or task request, pass through
  if (_.isUndefined(req.proj) && _.isUndefined(req.task)) {
    return next();
  }
  // Otherwise not allowed.
  return res.send(403, { message: "Not authorized." });
};