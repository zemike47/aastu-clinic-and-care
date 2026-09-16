import "dotenv/config";
import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();

  server.close(() => {
    console.log("Server stopped");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
