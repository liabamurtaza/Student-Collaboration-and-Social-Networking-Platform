const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/posts', require('./routes/posts'));

// ── 404 handler — unhandled routes return JSON ──────────
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong' });
});

// ── Connect DB then start server ────────────────────────
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('MongoDB connected');
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server running on port ${process.env.PORT || 5000}`);
		});
	})
	.catch((err) => console.error('MongoDB connection failed:', err));
