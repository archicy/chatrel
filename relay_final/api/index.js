let messages = [];
let users = {};

function randomId() {
  return Math.floor(Math.random() * 90000) + 10000;
}

function sendJSON(res, obj) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(obj));
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end('OK');
    return;
  }

  const url = req.url.split('?')[0];

  // GET /api/user - create or get user
  if (req.method === 'GET' && url === '/api/user') {
    const id = String(randomId());
    const username = `User${id}`;
    users[id] = { id, username, created_at: new Date().toISOString() };

    res.statusCode = 200;
    sendJSON(res, { user_id: id, username });
    return;
  }

  // GET /api/chat - get all messages
  if (req.method === 'GET' && (url === '/api/chat' || url === '/api/chat/')) {
    res.statusCode = 200;
    sendJSON(res, { messages: messages.slice(-50) });
    return;
  }

  // POST /api/chat - post a message
  if (req.method === 'POST' && (url === '/api/chat' || url === '/api/chat/')) {
    try {
      const raw = await collectBody(req);
      const data = raw ? JSON.parse(raw) : {};

      const message = {
        id: messages.length + 1,
        user_id: data.user_id || null,
        username: data.username || 'Anonymous',
        text: data.text || '',
        timestamp: new Date().toISOString()
      };

      messages.push(message);

      res.statusCode = 200;
      sendJSON(res, { success: true, message });
    } catch (err) {
      res.statusCode = 400;
      sendJSON(res, { success: false, error: String(err) });
    }
    return;
  }

  res.statusCode = 404;
  res.end('Not found');
};
