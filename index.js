import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

// Format of Token
// Authorization: Bearer <access_token>

// Verify Token
const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined min 11:54
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set Token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API!',
  });
});

app.post('/api/posts', [verifyToken], (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post Created',
        authData,
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // Mock User
  const user = {
    id: 1,
    username: 'Alestry',
    email: 'alestry@gotem.xyz',
  };

  jwt.sign({ user: user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token: token,
    });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
