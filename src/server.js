const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;
const prId = process.env.PR_ID || 'Production';
// Triggering PR comparison
// Initialize an isolated, in-memory/file SQLite database for this specific PR
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT)");
  db.run("INSERT INTO messages (text) VALUES ('Hello from isolated database environment!')");
});

app.get('/', (req, res) => {
  db.all("SELECT text FROM messages", [], (err, rows) => {
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f6f9;">
          <h1 style="color: #232f3e;">AWS DevOps Ephemeral Preview Environment</h1>
          <div style="background: white; display: inline-block; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p><strong>Status:</strong> Active</p>
            <p><strong>Environment ID:</strong> <span style="background: #ff9900; color: white; padding: 2px 8px; border-radius: 4px;">PR #${prId}</span></p>
            <p><strong>Deployment Context:</strong> Automatically Provisioned Preview Environment for Pull Request Validation</p>
            <p><strong>Database Record:</strong> "${rows[0] ? rows[0].text : 'No data'}"</p>
          </div>
        </body>
      </html>
    `);
  });
});

app.listen(port, () => {
  console.log(`Application running on port ${port} inside PR environment #${prId}`);
});