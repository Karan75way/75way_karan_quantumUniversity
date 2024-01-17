import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserRegistration from "../model/userRegistration"
import UserLogin from "../model/userLogin"
import validator from "../helper/validation";
import jwt from "jsonwebtoken";

const userController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      //checking if user already exist
      const existingUser = await UserRegistration.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validating email format
      if (!validator.validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validating password strength
      const passwordValidationResult =
        validator.validatePasswordStrength(password);
      if (passwordValidationResult.error) {
        return res.status(400).json({ error: passwordValidationResult.error });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new UserRegistration({
        name: name,
        email: email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  login: async (req:Request,res:Response)=>{
    try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res
            .status(400)
            .json({ error: "Email and password are required" });
        }
  
        // Validating email format
        if (!validator.validateEmail(email)) {
          return res.status(400).json({ error: "Invalid email format" });
        }
  
        // Checking if the user exists
        const user = await UserRegistration.findOne({email});
        console.log(email,password,user?.email,user?.password)
        if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
     console.log(email,password,user.email,user.password)
        // Checking if the provided password matches the hashed password in the database
        const passwordMatch =  bcrypt.compare(password, user.password??'');
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
  
        // Generating tokens
        const token=jwt.sign({ _id:user._id},"mynameiskaran");
  
        res.json({user, token });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  },
};

export default userController;


