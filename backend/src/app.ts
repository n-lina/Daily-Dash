import express, { Application, Request, Response } from "express";
const app: Application = express();
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

// ROUTES
const somethingRoute = require("./routes/somethings");
app.use("/somethings", somethingRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello world");
});

// Connect to db
mongoose.connect(
  process.env.DB_CONNECTION as string,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected")
);

// Start listening
app.listen(3000, () => console.log("Server is up"));
