import jwt from 'jsonwebtoken'

export default (request, response, next) => {
	const token = (request.headers.authorization || '').replace(/Bearer\s?/, '')

	if (token) {
		// расшифровка токена
		try {
			const decoded = jwt.verify(token, 'secret123')
			// Если запрос прошел, все корректно, выполняем некст
			request.userId = decoded._id
			next()
		} catch (error) {
			return response.status(403).json({
				massage: 'Нет доступа',
			})
		}
	} else {
		return response.status(403).json({
			massage: 'Нет доступа',
		})
	}
}
