const pool = require('../config/database'); // Database connection
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { username, email, password } = req.query; // Obtener los parámetros de la query string
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Verificar si el email ya existe
        const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Email is already in use' }); // 409 Conflict
        }

        // Crear el usuario si el email no existe
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

const updateUser = async (req,res) => {
    const { id, new_email, new_username } = req.query;
    if (!id || !new_email || !new_username){
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [new_username, new_email, id] 
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error during update:', error.message || error);
        res.status(500).json({ error: 'Internal server error during update' });
    }
}

module.exports = { registerUser, loginUser, updateUser };
