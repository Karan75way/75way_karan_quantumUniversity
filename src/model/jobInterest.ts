import mongoose, { Document, Schema } from "mongoose";

// export interface JobInterest extends Document {
//   name: string;
//   userId: string;
//   interestedUser: string[];
// }

const jobInterest = new Schema({
  name: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
  },
  interestedUser: { type: Array, default: [] },
});

const JobInterest = mongoose.model("JobInterest", jobInterest);

export default JobInterest;
