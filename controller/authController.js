const Model = require("../model/userModel");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");

class AuthController {
    async login(req, res) {
        try {
            const {username, password} = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const user = await  Model.findByUsername(username);
            console.log("User found:", user);

            if (!user || user.length === 0) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            
            if (!comparePassword(password, user[0].password)) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = generateToken({ id: user[0].id, username: user[0].username });

            res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user[0].id,
                    username: user[0].username
                }
            })
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async register(req, res) {
        try {
            const {username, password} = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Invalid username or password" });
            }

            if ( password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }

            const existingUser = await Model.findByUsername(username);
            if (existingUser && existingUser.length > 0) {
                return res.status(409).json({ message: "Username already exists" });
            }

            // Here you would typically hash the password before saving it
            // For simplicity, we are not doing that in this example

            const hashedPassword = await hashPassword(password);
            

            // Save user to database logic goes here

            const userId = await Model.createUser(username, hashedPassword);


            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new AuthController();