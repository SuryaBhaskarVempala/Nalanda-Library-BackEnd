const { authCheck, getToken } = require("../Middlewares/Auth");
const Member = require("../Models/Members.js");
const logger = require("../Utils/logger.js");


// Signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        logger.warn("Signup attempt with missing fields");
        return res.status(400).json({ message: "All fields (name, email, password) are required" });
    }

    try {
        const user = await Member.create({ name, email, password });
        logger.info(`New user created: ${user.email}`);

        // Generate JWT token
        const token = getToken({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        return res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        if (error.code === 11000) {
            logger.warn(`Signup attempt with existing email: ${email}`);
            return res.status(409).json({ message: "Email already registered" });
        }
        logger.error(`Signup error: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
}




// Login
const login =  async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn("Login attempt with missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Member.findOne({ email });
        if (!user) {
            logger.warn(`Invalid login attempt for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            logger.warn(`Invalid password attempt for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = getToken({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        logger.info(`User logged in: ${email}`);

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
}


//  Get User By Token 
const getUserByToken = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("Token not provided in auth check");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = authCheck(token);
        logger.info(`Auth check successful for user: ${payload.email}`);
        return res.status(200).json({ user: payload });
    } catch (error) {
        logger.error(`Invalid token during auth check: ${error.message}`);
        return res.status(401).json({ message: "Invalid token" });
    }
}



module.exports = {
    signup,
    login,
    getUserByToken
}