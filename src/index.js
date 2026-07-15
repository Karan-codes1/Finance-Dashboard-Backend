import express from "express";
import dotenv from "dotenv";


import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from './models/db.js';
import { verifyToken, allowRoles } from "./middleware/auth.middleware.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";

import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { authLimiter } from "./middleware/rateLimiter.middleware.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

// Routes
// Home route
  app.get("/", (req, res) => {
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Finance Dashboard Backend API</title>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
  *{
      margin:0;
      padding:0;
      box-sizing:border-box;
      font-family:'Inter',sans-serif;
  }

  body{
      min-height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb);
      overflow:hidden;
      position:relative;
  }

  /* Background blobs */

  body::before,
  body::after{
      content:"";
      position:absolute;
      border-radius:50%;
      filter:blur(120px);
      opacity:.35;
  }

  body::before{
      width:350px;
      height:350px;
      background:#38bdf8;
      top:-100px;
      left:-120px;
  }

  body::after{
      width:320px;
      height:320px;
      background:#7c3aed;
      bottom:-120px;
      right:-120px;
  }

  .card{
      position:relative;
      z-index:2;
      width:min(700px,90%);
      background:rgba(255,255,255,.08);
      backdrop-filter:blur(18px);
      border:1px solid rgba(255,255,255,.15);
      border-radius:24px;
      padding:45px;
      color:white;
      box-shadow:0 20px 60px rgba(0,0,0,.35);
  }

  .badge{
      display:inline-block;
      padding:8px 16px;
      background:#16a34a;
      border-radius:999px;
      font-size:.85rem;
      font-weight:600;
      margin-bottom:18px;
  }

  h1{
      font-size:2.5rem;
      margin-bottom:15px;
  }

  p{
      color:#d1d5db;
      line-height:1.7;
      margin-bottom:25px;
  }

  .grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
      gap:15px;
      margin:30px 0;
  }

  .feature{
      background:rgba(255,255,255,.08);
      padding:18px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.08);
  }

  .feature h3{
      margin-bottom:8px;
      font-size:1rem;
  }

  .feature p{
      margin:0;
      font-size:.9rem;
  }
  .resources{
    margin-top:30px;
}

.resources h3{
    margin-bottom:16px;
    font-size:1.15rem;
    color:#fff;
}

.resource-link{
    display:block;
    width:fit-content;
    margin:12px 0;
    color:#7dd3fc;
    text-decoration:underline;
    text-underline-offset:4px;
    text-decoration-thickness:2px;
    font-weight:600;
    transition:all .25s ease;
}

.resource-link:hover{
    color:#ffffff;
    transform:translateX(6px);
}

.resource-link:visited{
    color:#a78bfa;
}
  .footer{
      margin-top:35px;
      font-size:.85rem;
      color:#cbd5e1;
      text-align:center;
  }

  .author-link{
    color:#7dd3fc;
    text-decoration:underline;
    text-underline-offset:3px;
    font-weight:600;
    transition:all .25s ease;
}

.author-link:hover{
    color:#ffffff;
}
  </style>

  </head>

  <body>

  <div class="card">

  <span class="badge"> Backend Online</span>

  <h1>Finance Dashboard API</h1>

  <p>
  A secure RESTful backend built using
  <strong>Node.js</strong>,
  <strong>Express.js</strong>,
  <strong>MongoDB</strong>,
  and
  <strong>JWT Authentication</strong>.
  Supports Role-Based Access Control, analytics, CRUD operations,
  pagination, filtering, and dashboard insights.
  </p>

  <div class="grid">

  <div class="feature">
  <h3>Authentication</h3>
  <p>JWT Login, Signup & Role-Based Authorization</p>
  </div>

  <div class="feature">
  <h3>Dashboard</h3>
  <p>Analytics, revenue metrics and insights APIs</p>
  </div>

  <div class="feature">
  <h3>Records</h3>
  <p>Secure CRUD operations with pagination & filtering</p>
  </div>

  <div class="feature">
  <h3>⚡ Rate Limiting</h3>
  <p>API protection using Express Rate Limit</p>
  </div>

  </div>

  <div class="resources">

    <h3>Resources</h3>

    <a
        class="resource-link"
        href="https://github.com/Karan-codes1/Finance-Dashboard-Backend"
        target="_blank"
    >
        GitHub Repository ↗
    </a>

    <a
        class="resource-link"
        href="https://github.com/Karan-codes1/Finance-Dashboard-Backend/blob/main/README.md"
        target="_blank"
    >
         Documentation (README) ↗
    </a>

</div>

  <div class="footer">
  Made with ❤️ by
  <a
    href="https://www.linkedin.com/in/karan-raj2005/"
    target="_blank"
    rel="noopener noreferrer"
    class="author-link"
  >
    Karan Raj
  </a>
</div>

  </div>

  </body>
  </html>
    `);
  });

// Rout
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

const PORT = 5001;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();