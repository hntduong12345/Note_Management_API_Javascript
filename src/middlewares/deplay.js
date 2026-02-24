const delay = (req, res, next) => {
  setTimeout(() => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]; //Take value after the Bearer
    }

    next();
  }, 3000);
};

module.exports = delay;
