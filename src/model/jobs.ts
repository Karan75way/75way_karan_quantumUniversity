import mongoose, { Document, Schema } from "mongoose";

export interface Jobs extends Document {
  title: string;
  description: string;
  category: string;
  jobInterest: string;
  applicants: string[];
}

const jobs = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, //ex:Software Engineer
  jobInterest: {
    type: String,
    required: true,
  },// ex:frontend developer
  applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const JobModel = mongoose.model<Jobs & Document>('Job', jobs);

export default JobModel;


