import express from "express";
import mongoose, { Model } from "mongoose";
import userRoutes from "./route/userRoutes";
import JobCategory from "./model/jobCategories";
import dotenv from "dotenv";

import emailNotification from "./helper/email";
import jobInterest from "./model/jobInterest";
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

  const job=await jobInterest.findById("65a76b16bc2770a8e5bf0697").populate("interestedUser");
  console.log(job);

    try {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      console.log("Collections in the database:");
      const jobsCollection = collections.find((collection: { name: string }) => collection.name === 'jobs');
      console.log(jobsCollection?.name)
      emailNotification(jobsCollection?.name||'')
    
    } catch (error) {
      console.log(error);
    } 
  })
  .catch((error) => {
    console.log(error);
  });


app.listen(3000, () => {
  console.log(`server is running at port ${process.env.SERVER_PORT || 3000}`);
});
