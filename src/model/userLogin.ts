import mongoose from "mongoose";
const Schema=mongoose.Schema;

const userLogin = new Schema({
 email:{
    type:String,
    require:true
 },
 password:{
    type:String,
    require:true,
 },
});


const UserLogin = mongoose.model('UserLogin', userLogin);

export default UserLogin;
