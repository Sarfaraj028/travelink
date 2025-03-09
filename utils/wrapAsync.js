const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next); // This catches async errors and forwards them to the error handler
  };
};


export default wrapAsync