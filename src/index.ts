import express from "express";
import mongoose from "mongoose";
import userRoutes from "./route/userRoutes";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);

const MONGO_URL =
  "mongodb+srv://karankumarmaurya2002:6TZlpDwiwV1vjBSP@cluster0.crowhqu.mongodb.net/assessment_1?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("Database connected !!!!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log(`server is running at port ${process.env.SERVER_PORT || 3000}`);
});
