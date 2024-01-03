import express from "express";
import vehicleRoute from "./routes/vehicle.js";
import driverRoute from "./routes/driver.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3200;

app.use(express.json());
app.use("/vehicle", vehicleRoute);
app.use("/driver", driverRoute);

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default server;