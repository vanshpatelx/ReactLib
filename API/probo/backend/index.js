const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = 'your_jwt_secret_key';

const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;

  // Check if the email already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Add the new user
  const newUser = {
    id: users.length + 1,
    email,
    password, // In production, hash the password before saving.
  };
  users.push(newUser);

  // Save to "database" (users.json)
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

  // Generate token and send response
  const token = generateToken(newUser);
  res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
});

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/api/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
