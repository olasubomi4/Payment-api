class ApiErrorClass {
    constructor(statusCode, msg) {
      this.statusCode = statusCode;
      this.msg = msg;
    }
  
    static invalidRequest(msg) {
      return new ApiErrorClass(400, msg);
    }
  
    static internalError(msg) {
      return new ApiErrorClass(500, msg);
    }
  }
  
  module.exports = ApiErrorClass;