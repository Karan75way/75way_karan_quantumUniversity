
import mongoose, { Document, Schema } from "mongoose";

export interface JobInterest extends Document {
  name: string;
  userId: string;
  interestedUser:string[];
}

const jobInterest = new Schema({
  name: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
  },
  interestedUser:
     [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<JobInterest>("JobInterest", jobInterest);
