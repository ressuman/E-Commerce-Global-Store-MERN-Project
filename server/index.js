import dotenv from "dotenv";
dotenv.config();

import dbconfig from "./config/dBConfig.js";

import app from "./app.js";

const PORT = process.env.PORT_NUMBER || 3320;
const HOST = process.env.PORT_HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(
    `Server is running: Listening to requests at http://${HOST}:${PORT}`
  );
});
