exports.mwOne = (req, res, next) => {
  req.middlewareOneExecuted = true;
  next();
}

exports.mwTwo = (req, res, next) => {
  req.middlewareTwoExecuted = true;
  next();
}