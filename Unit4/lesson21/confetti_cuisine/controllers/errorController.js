const httpStatus = require("http-status-codes");

// handles unhandled requests
exports.pageNotFoundError = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.render("error");
};

// handles server errors
exports.internalServerError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occurred: ${error.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is taking a nap!`);
};

// This code defines two Express.js middleware functions for error handling:
//pageNotFoundError handles unrecognized routes by setting a 404 (Not Found)
// status and rendering an error view.
// internalServerError handles server-side errors by logging the error
// stack trace, setting a 500 (Internal Server Error) status, and sending
// a user-friendly error message in the response.
// Overall, it provides basic handling for missing pages and unexpected
// server errors.
