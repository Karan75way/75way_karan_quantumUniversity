import mongoose, { Document, Schema } from "mongoose";

// export interface Jobs extends Document {
//   title: string;
//   description: string;
//   category: string;
//   jobInterest: string;
//   applicants: string[];
// }

const jobs = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Software Engineer
  jobInterest: {
    type: String,
    required: true,
  }, // frontend developer
  applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Jobs = mongoose.model("Jobs", jobs);

export default Jobs;
