const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {
	const header = req.headers.authorization
	if (!header) {
		return res.status(401).json({ error: 'Authorization header missing' })
	}

	const [scheme, token] = header.split(' ')
	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({ error: 'Invalid authorization format' })
	}

	const secret = process.env.JWT_SECRET
	if (!secret) {
		return res.status(500).json({ error: 'JWT_SECRET not set' })
	}

	try {
		const payload = jwt.verify(token, secret)
		req.user = payload
		return next()
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired token' })
	}
}
