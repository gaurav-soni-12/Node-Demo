const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

// Initialize .env
dotenv.config({ path: 'local.env' })

// Initialize Application
const app = express();

app.use(cookieParser());

// Port
const PORT = process.env.PORT || 8080

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/admin", userAuth, (req, res) => res.send("User Route"))

// Routes
app.use(router);

app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });

