import { Request, Response } from "express";
import jobCategory from "../model/jobCategories";
import job from "../model/jobs";
import jwt from "jsonwebtoken";
import jobInterest from "../model/jobInterest";
import UserRegistration from "../model/userRegistration";
import jobs from "../model/jobs";

const jobController = {
  categories: async (req: Request, res: Response) => {
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
      const { title, description, category ,jobInterest} = req.body;

      if (!title || !description || !category||!jobInterest) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const newJob = await job.create({
        title,
        description,
        category,
        jobInterest,
      });

      await newJob.save();

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
      const existingJobInterest = await jobInterest.findOne({ name });
      if (existingJobInterest) {
        return res
          .status(400)
          .json({ error: "This job interest already exists" });
      }

      if (!name) {
        return res.status(400).json({ error: "Job interest name is required" });
      }

      const newJobInterest = await jobInterest.create({ name, userId });
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
      const userId = decodedToken._id;
      const { jobInterestId } = req.params;

      const jobInterests = await jobInterest.findById(jobInterestId);
      const user = await UserRegistration.findById(userId);


      console.log("inters",jobInterests)
      console.log("user",user)
      if (!jobInterests || !user) {
        return res.status(404).json({ error: "Job Interest or user not found" });
      }

      if (jobInterests?.interestedUser.includes(userId)) {
        return res
          .status(400)
          .json({ error: "User already selected" });
      }

      jobInterests?.interestedUser.push(userId);
      await jobInterests?.save();

      res.json({ message: "Interest selection successful" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default jobController;
