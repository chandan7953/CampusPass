const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


require("dotenv").config();

const app = require("./app");
const connectDB = require("./configs/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();