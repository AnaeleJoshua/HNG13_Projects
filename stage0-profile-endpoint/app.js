const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logEvents = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

app.get('/me', async (req, res) => {
  const currentTime = new Date().toISOString();

  try {
    const catFactResponse = await axios.get('https://catfact.ninja/fact', { timeout: 10000 });
    const catFact = catFactResponse.data.fact;

    await logEvents(`SUCCESS: Cat fact fetched - ${catFact}`, 'requestLog.txt');

    res.status(200).json({
      status: 'success',
      user: {
        name: 'Anaele Joshua',
        email: 'anaelejoshua0508@gmail.com',
        stack: 'Node.js',
      },
      timestamp: currentTime,
      fact: catFact,
    });
  } catch (err) {
    const isTimeout = err.code === 'ECONNABORTED';
    const errorMsg = isTimeout ? 'Timeout fetching cat fact' : err.message;

    await logEvents(`ERROR: ${errorMsg}`, 'errorLog.txt');

    res.status(500).json({
      timestamp: currentTime,
      status: 'error',
      message: isTimeout
        ? 'Request to cat fact API timed out. Please try again.'
        : 'Could not fetch cat fact right now.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
