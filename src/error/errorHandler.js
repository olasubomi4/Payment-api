const ApiErrorClass = require('./ApiError');

function errorHandler(err, req, res, next) {
  console.log(err);
  
  if (err instanceof ApiErrorClass) 
 {
    res.status(err.statusCode)
      .json(err.msg);
    return;
  }
  res.status(500)
    .json('Something went wrong. Check post input');
}
module.exports = errorHandler;