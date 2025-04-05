import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ error: "user already exist" });
    }

    const user = new User({ username, password, email });

    await user.save();

    const payload = { _id: user._id };

    const token = jwt.sign(payload, process.env.jwt_secret, {
      expiresIn: "4h",
    });

    res.status(201).json(token);
  } catch (error) {
    console.error("failed to signup ", error);
    res.status(500).json({ error: "failed to signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    if (!user.comparePassword(password)) {
      return res.status(400).json({ error: "invalid credentails" });
    }
    const payload = { _id: user._id };

    const token = jwt.sign(payload, process.env.jwt_secret, {
      expiresIn: "4h",
    });

    res.status(200).json(token);
  } catch (error) {
    console.error("failed to login ", error);
    res.status(500).json({ error: "failed to login" });
  }
};


export const getUser = async (req, res) => {

    console.log(req.user)
    
   res.status(200).json({message:'welcome to dashboard'})
       
}