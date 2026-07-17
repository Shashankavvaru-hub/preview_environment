const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;
const prId = process.env.PR_ID || 'Production';

// Initialize an isolated, in-memory SQLite database for this specific PR
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT)");
  db.run("INSERT INTO messages (text) VALUES ('Hello from isolated database environment!')");
});

app.get('/', (req, res) => {
  db.all("SELECT text FROM messages", [], (err, rows) => {
    const dbRecord = rows[0] ? rows[0].text : 'No data';
    
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS DevOps Preview - PR #${prId}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Animated background elements */
        .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.03);
            animation: float 10s infinite ease-in-out;
            pointer-events: none;
        }

        .circle:nth-child(1) { width: 300px; height: 300px; top: -100px; left: -100px; animation-delay: 0s; }
        .circle:nth-child(2) { width: 500px; height: 500px; bottom: -200px; right: -150px; animation-delay: -3s; }
        .circle:nth-child(3) { width: 200px; height: 200px; top: 40%; left: 60%; animation-delay: -7s; }

        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.05); }
        }

        .container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 50px 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            position: relative;
            z-index: 10;
            transform: translateY(20px);
            opacity: 0;
            animation: slideUp 0.8s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            to { transform: translateY(0); opacity: 1; }
        }

        h1 {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .info-grid {
            display: grid;
            gap: 20px;
        }

        .info-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease;
        }

        .info-card:hover {
            background: rgba(0, 0, 0, 0.3);
            transform: translateX(5px);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .label {
            font-weight: 600;
            color: #a0aec0;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .value {
            font-size: 1.1rem;
            font-weight: 400;
            color: #e2e8f0;
            text-align: right;
        }

        .badge {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
            display: inline-block;
        }
        
        .status-dot {
            height: 10px;
            width: 10px;
            background-color: #10b981;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
            box-shadow: 0 0 10px #10b981;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .context-box {
            margin-top: 25px;
            padding: 15px;
            border-radius: 10px;
            background: rgba(59, 130, 246, 0.1);
            border-left: 4px solid #3b82f6;
            font-size: 0.95rem;
            color: #cbd5e1;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>

    <div class="container">
        <h1>Ephemeral Preview(shashank)</h1>
        
        <div class="info-grid">
            <div class="info-card" style="animation: slideUp 0.8s forwards 0.1s; opacity: 0; transform: translateY(10px);">
                <div class="label">Status</div>
                <div class="value"><span class="status-dot"></span>Active</div>
            </div>
            
            <div class="info-card" style="animation: slideUp 0.8s forwards 0.2s; opacity: 0; transform: translateY(10px);">
                <div class="label">Environment ID</div>
                <div class="value"><span class="badge">PR #${prId}</span></div>
            </div>
            
            <div class="info-card" style="animation: slideUp 0.8s forwards 0.3s; opacity: 0; transform: translateY(10px);">
                <div class="label">Database Record</div>
                <div class="value" style="font-style: italic;">"${dbRecord}"</div>
            </div>
        </div>
        
        <div class="context-box" style="animation: slideUp 0.8s forwards 0.4s; opacity: 0; transform: translateY(10px);">
            Automatically provisioned preview environment for Pull Request validation. Connected to isolated in-memory SQLite database.
        </div>
    </div>
</body>
</html>
    `);
  });
});

app.listen(port, () => {
  console.log(`Application running on port ${port} inside PR environment #${prId}`);
});