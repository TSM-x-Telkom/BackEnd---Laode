const express = require("express");
const authController = require("./controller/authController");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.post('/login',authController.login);

app.get("/", (req, res) => {
    res.send("Hello Worlda!")
});

app.listen(port, () => {
    console.log(`Running on port: ${port}`);
})