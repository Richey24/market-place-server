
// export function successResponder(response: Response, payload: any, opt: ResponseMessage) {

const successResponder = (response, payload, statusCode = 200, message = 'ok') => {
	return response.status(statusCode).json({
		isError: false,
		message,
		payload,
	});
}

const errorResponder = (response, statusCode, message) => {

	return response.status(statusCode ?? 500).json({
		isError: true,
		description: message,
		// a friendly message for the frontend
		message: message ?? 'Server Error',
		payload: null,
	});
}


module.exports = { successResponder, errorResponder }