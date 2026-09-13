import dotenv from "dotenv";

dotenv.config();
import express from "express";
import httpProxy from "http-proxy";

const app = express();

const proxy = httpProxy.createProxyServer();

// const servers = ["http://localhost:5001", "http://localhost:5002"];

const servers = [
  `http://localhost:${process.env.API_SERVER_1_PORT}`,
  `http://localhost:${process.env.API_SERVER_2_PORT}`,
];

let currentServer = 0;

app.use((req, res) => {
  const target = servers[currentServer];

  console.log(`Request ${req.method} ${req.url} → ${target}`);

  currentServer = (currentServer + 1) % servers.length;

  proxy.web(req, res, {
    target,
  });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    instance: INSTANCE,
  });
});
