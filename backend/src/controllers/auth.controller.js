// backend/src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Controller for user signup
export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the given email already exists
        if (await User.findOne({ email })) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};

// Controller for user login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if the user exists and if the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JSON Web Token (JWT) for the authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};