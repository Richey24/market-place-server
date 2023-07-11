/**
 * Refers to programmer error, or error from external API
 * Example: Error from google map API
 */
class ServerError extends Error {
	constructor(message, name = 'SERVER ERROR') {
		super(message);
		this.name = name || 'SERVER ERROR';
		this.code = 500;
	}
}

class DatabaseError extends Error {
	constructor(message) {
		super(message);
		this.name = 'DATABASE ERROR';
		this.code = 500;
	}
}

/**
 * Refers to error that are caused by user input
 * Example: Passing wrong data types or values
 */
class UserError extends Error {
	constructor(message, name = 'BAD REQUEST') {
		super(message);
		this.name = name ?? 'BAD REQUEST';
		this.code = 400;
	}
}

class PermissionError extends Error {
	constructor(message = "You don't have the necessary permission to perform this action") {
		super();
		this.message = message || "You don't have the necessary permission to perform this action";
		this.name = 'PERMISSION ERROR';
		this.code = 400;
	}
}

class NotFoundError extends Error {
	constructor(message) {
		super();
		this.message = message ?? 'Item not found';
		this.name = 'NOT FOUND';
		this.code = 404;
	}
}

class NotImplementedError extends ServerError {
	constructor() {
		super('Not implemented', 'Server Error');
		this.code = 501;
	}
}


module.exports = { ServerError, DatabaseError, UserError, PermissionError, NotFoundError, NotImplementedError }