const db = require("../models/index")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

var User = db.user;
const saltRounds = 10
const jwtSecret = "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd"

// get all users
const getUsers = async (req, res) => {
    await User.findAll()
        .then(userResponse => {
            res.status(200).json(userResponse)
        })
        .catch(error => {
            res.status(400).send(error)
        })
}

// create new user
const createUser = async (req, res) => {
    var password = req.body['password']
    // hash password
    await bcrypt
        .hash(password, saltRounds)
        .then(hash => {
            req.body['password'] = hash
            console.log('Hash ', req.body)
        })
        .catch(err => console.error(err.message))

    await User.create(req.body)
        .then(userResponse => {
            res.status(200).json(userResponse)
        })
        .catch(error => {
            res.status(400).send({ status: 400, message: error.errors[0].message })
        })
}

// update new user
const updateUser = async (req, res) => {
    await User.update(req.body, {
        where: {
            user_id: req.params.uuid
        }
    })
        .then(userResponse => {
            res.status(200).json({ status: 200, message: "User updated successfully" })
        })
        .catch(error => {
            res.status(400).send({ status: 400, message: error.errors[0].message })
        })
}

// delete new user
const deleteUser = async (req, res) => {
    await User.destroy({
        where: {
            user_id: req.params.uuid
        }
    })
        .then(userResponse => {
            res.status(200).json({ status: 200, message: "User deleted successfully" })
        })
        .catch(error => {
            res.status(400).send({ status: 400, message: error.errors[0].message })
        })
}

// login user
const userLogin = async (req, res) => {
    var user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (user === null) {
        return res.status(400).send({
            status: 400,
            message: "User not found."
        });
    }
    else {
        // compare password
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            // Set cookie
            const maxAge = 1 * 60 * 60;
            const token = jwt.sign(
                { id: user.user_id, firstName: user.email },
                jwtSecret,
                {
                    expiresIn: maxAge, // 1hrs in sec
                }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 1hrs in ms
            });
            return res.status(201).send({
                status: 201,
                message: "User Logged In",
                user: user,
            })
        } else {
            return res.status(400).send({
                status: 400,
                message: "Wrong Password"
            });
        }
    }

}

// login user
const logoutUser = (req, res) => {
    // remove cookie
    res.cookie("jwt", "", { maxAge: "1" })
    return res.status(400).send({
        status: 200,
        message: "User Logged Out"
    });
}

module.exports = { getUsers, createUser, deleteUser, updateUser, userLogin, logoutUser }