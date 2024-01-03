import express from "express";
import vehicleRoute from "./routes/vehicle.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3200;

app.use(express.json());
app.use("/vehicle", vehicleRoute);

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default server;