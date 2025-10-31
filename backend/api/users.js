import express from 'express';
import { createUser, findUserByUsername, userLogin, findUserByTwitchId } from '../db/adapters/users.js';
import { requireAdminUser, requireUser } from './modules/requireUser.js';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();
const { JWT_SECRET } = process.env;
const userRouter = express.Router();

userRouter.use(express.json());

// POST /api/user/register
userRouter.post('/register', async function (req, res, next) {
  // req.body required format
  // {
  //  username
  //  password
  // }
  try {
    // ensure that password and username exist
    if (!req.body.username || !req.body.password) {
      next({
        name: "Failed to create user",
        message: "No username/password provided"
      });
      return;
    }

    // first check if the username / user already exists
    const user = await findUserByUsername(req.body.username);
    if (user) {
      next({
        name: "Failed to create user",
        message: "Username already exists"
      });
      return;
    }
    let newUser = {
      username: req.body.username,
      password: req.body.password,
      twitchUserId: '',
      twitchDisplayName: '',
      userAccessToken: {
        token: '',
        refreshToken: '',
      },
      scopes: []
    };
    // store user in database
    let { username, _id } = await createUser(newUser);

    const token = jwt.sign({
      username,
      _id
    }, JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({
      message: "User created successfully",
      token
    });
  } catch (err) {
    console.log('error on register route');
    next(err);
  }
})

// POST /api/user/login
userRouter.post('/login', async function (req, res, next) {
  try {
    const user = await userLogin(req.body.username, req.body.password);
    if (!user) {
      next({
        error: "Failed to login",
        reason: "Invalid credentials"
      });
      return;
    }

    let { username, _id } = user;
    const token = jwt.sign({
      username,
      _id
    }, JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.log('error on login route');
    next(err);
  }
});

// GET /api/user/myuser
userRouter.get('/myuser', requireUser, async (req, res, next) => {
  res.send({
    ...req.user
  });
});

// GET /api/user/:twitchUserId
userRouter.get('/:twitchUserId', requireAdminUser, async (req, res, next) => {
  try {
    const twitchUserId = req.params.twitchUserId;
    const user = await findUserByTwitchId(twitchUserId);
    res.send(user);
  } catch (err) {
    console.log('error while getting user by twitch user id');
    next(err);
  }
})

export default userRouter;