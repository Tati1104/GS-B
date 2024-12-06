const pool = require('../config/database'); // Database connection
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { username, email, password } = req.query; // Obtener los parámetros de la query string
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [username, email, hashedPassword]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error during registration:', error.message || error);
        res.status(500).json({ error: 'Internal server error during registration' });
    }
};
// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.query;

    try {
        // Query database for user by username or email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare input password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Send user details (excluding password)
        const { id,name: uname, email: uemail } = user;
        res.json({ id, name: uname, email: uemail });
    } catch (error) {
        console.error('Error during login:', error.message || error);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { registerUser, loginUser };
