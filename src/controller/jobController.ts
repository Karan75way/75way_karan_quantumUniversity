import { Request, Response } from "express";
import jobCategory from "../model/jobCategories";
import job from "../model/jobs";
import jwt from "jsonwebtoken";
import jobInterests from "../model/jobInterest";
import UserRegistration from "../model/userRegistration";
import jobs from "../model/jobs";
import * as nodemailer from 'nodemailer';

const jobController = {
  categories: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      console.log("token",token)
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Token not provided" });
      }

      const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY||"mynameiskaran");
      console.log("decoded token",decodedToken)
      const userId = decodedToken._id;
      console.log("User Id", userId);

      const { name } = req.body;
      const existingCategory = await jobCategory.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }

      if (!name) {
        return res.status(400).json({ error: "Job category name is required" });
      }

      const newJobCategory = await jobCategory.create({ name, userId });
      await newJobCategory.save();

      res.json({ jobCategory: newJobCategory });
    } catch (error) {
      console.error("Error while creating job category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  jobs: async (req: Request, res: Response) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'karankumarmaurya2002@gmail.com',
          pass: 'uggvrotavfegisir',
        },
      });
      
      const { title, description, category ,jobInterest} = req.body;

      if (!title || !description || !category||!jobInterest) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingJobInterest = await jobInterests.findOne({name:jobInterest});
      
      console.log("existingJobInterest",existingJobInterest)
      if (!existingJobInterest) {
        return res.status(400).json({
          message: "Create Job Interest first...",
        });
      }

      const interestedUsers = existingJobInterest.interestedUser;
      console.log("interestedUsers:",interestedUsers)
      const newJob = await job.create({
        title,
        description,
        category,
        jobInterest,
      });

      await newJob.save();
      const mailOptions = {
        from: process.env.COMPANY_EMAIL,
        to: interestedUsers,
        subject: "New Job Posted",
        text: `A new job of your interest has been posted.`,
      };
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Error Sending email..."
          });
        }
      });
      return res.status(201).json({
        message: "Job created successfully and email sent securely...",
        job
      });

      res.json({ newJob: newJob });
    } catch (error) {
      console.error("Error while creating new job :", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  jobInterest: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Token not provided" });
      }

      const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY||"mynameiskaran");
      const userId = decodedToken._id;
      console.log("User Id", userId);

      const { name } = req.body;
      const existingJobInterest = await jobInterests.findOne({ name });
      if (existingJobInterest) {
        return res
          .status(400)
          .json({ error: "This job interest already exists" });
      }

      if (!name) {
        return res.status(400).json({ error: "Job interest name is required" });
      }

      const newJobInterest = await jobInterests.create({ name, userId });
      await newJobInterest.save();

      res.json({ newJobInterest: newJobInterest });
    } catch (error) {
      console.error("Error while creating job interest:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  jobApply: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Token not provided" });
      }

      const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY||"mynameiskaran");
      const userId = decodedToken._id;
      const { jobId } = req.params;

      const job = await jobs.findById(jobId);
      const user = await UserRegistration.findById(userId);

      if (!job || !user) {
        return res.status(404).json({ error: "Job or user not found" });
      }

      if (job.applicants.includes(userId)) {
        return res
          .status(400)
          .json({ error: "User already applied for this job" });
      }

      job.applicants.push(userId);
      await job.save();

      res.json({ message: "Application successful" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  allApplicants: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const job = await jobs.findById(jobId).populate("applicants");
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      const applicants = job.applicants;
      res.json(applicants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  jobInterestedUser: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Token not provided" });
      }

      const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY||"mynameiskaran");
      console.log(decodedToken)
      const userId = decodedToken._id;
      const { jobInterestId } = req.params;

      const jobInterest = await 
      jobInterests.findById(jobInterestId);
      const user = await UserRegistration.findById(userId);


      console.log("total job interests",jobInterest)
      console.log("user",user)
      if (!jobInterest || !user) {
        return res.status(404).json({ error: "Job Interest or user not found" });
      }

      if (jobInterest?.interestedUser.includes(userId)) { 
        return res
          .status(400)
          .json({ error: "User already selected" });
      }

      jobInterest?.interestedUser.push(user.email??'');
     const allInteresdtedUser= await jobInterest.populate('interestedUser');
     console.log("allInterestedUser",allInteresdtedUser)
      console.log("job interested userID",userId)
      console.log("JobInterested User email:",user.email)
      await jobInterest?.save();

      res.json({ message: "Interest selection successful" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default jobController;
