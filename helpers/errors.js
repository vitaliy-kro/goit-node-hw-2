class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    this.message = message;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.message = message;
  }
}

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.message = message;
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  NotFound,
  Conflict,
};
