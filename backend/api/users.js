import express from 'express';
import { createUser, findUserByUsername } from '../db/adapters/users.js';
import { hashPassword, verifyPassword } from './modules/hash.js';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();
const { JWT_SECRET } = process.env;
const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post('/register', async function (req, res) {
  // req.body required format
  // {
  //  username
  //  password
  // }
  try {
    // ensure that password and username exist
    if (!req.body.username || !req.body.password) {
      res.send({
        error: "Failed to create user",
        reason: "No username/password provided"
      });
      return;
    }

    // first check if the username / user already exists
    const user = await findUserByUsername(req.body.username);
    if (user) {
      res.send({
        error: "Failed to create user",
        reason: "Username already exists"
      });
      return;
    }
    const hashedPassword = await hashPassword(req.body.password);
    let newUser = {
      username: req.body.username,
      password: hashedPassword,
      twitchClientId: '',
      twitchUserId: '',
      twitchDisplayName: '',
      userAccessToken: '',
      refreshToken: '',
      scopes: []
    }
    // store user in database
    let createdUser = await createUser(newUser);

    //create jwt token using username and password
    let simpleUser = {
      username: req.body.username,
    }
    const token = jwt.sign(simpleUser, JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({
      message: "User created successfully",
      token
    });
  } catch (err) {
    console.log(err);
  }
})

userRouter.post('/login', async function (req, res) {
  try {
    console.log(req.body)
    const user = await findUserByUsername(req.body.username);
    if (!user) {
      res.send({
        error: "Failed to login",
        reason: "Invalid credentials"
      });
      return;
    }
    let isValid = await verifyPassword(req.body.password, user?.password);

    if (!isValid) {
      res.send({
        error: "Failed to login",
        reason: "Invalid credentials"
      });
      return;
    }
    delete user.password;

    const token = jwt.sign({
      username: req.body.username
    }, JWT_SECRET);

    res.send({
      message: "Login successful",
      token
    })

  } catch (err) {
    console.log('error logging in');
    console.log(err);
  }
})

export default userRouter;