// backend/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Simulação de usuários (exemplo). Em produção, use um banco de dados!
const users = [
  { id: 1, username: 'admin', passwordHash: bcrypt.hashSync('admin123', 8) }
];

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// POST /auth/login { username, password }
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica se o usuário existe
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Valida a senha
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Gera token JWT
  const token = jwt.sign(
    { sub: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({ token });
});

export default router;
