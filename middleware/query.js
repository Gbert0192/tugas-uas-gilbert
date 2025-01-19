export const setQueryPaginations = (req, res, next) => {
  req.query.page = req.query.page || 1;
  req.query.limit = req.query.limit || 20;
  next();
};
