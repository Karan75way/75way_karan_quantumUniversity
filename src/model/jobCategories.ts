
import mongoose, { Document, Schema } from "mongoose";

export interface JobCategory extends Document {
  name: string;
  userId: string;
  interestedUser:string[];
}

const jobCategory = new Schema({
  name: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
  },
  interestedUser:
     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
});


export default mongoose.model<JobCategory>("JobCategory", jobCategory);
