import express from 'express';
import { createUser, findUserByUsername, userLogin, findUserByTwitchId, updateUser } from '../../db/adapters/users.js';
import { requireAdminUser, requireUser } from '../modules/requireUser.js';
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
      twitchLogin: '',
      twitchDisplayName: '',
      userAccessToken: {
        token: '',
        refreshToken: '',
      },
      channelInfo: {
        moderators: []
      },
      botSettings: {
        gtotMode: {
          enabled: false,
          toggle: false
        },
        autoShoutout: {
          enabled: false,
          twitchDisplayNames: []
        },
        autoShoutoutRaid: {
          enabled: true
        },
        raffle: {
          enabled: true,
          raffleOpen: false
        },
        randomInsult: {
          enabled: false
        },
        scopes: [],
      }
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
        name: "Failed to login",
        message: "Invalid credentials"
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

// PATCH /api/user
  // req.body does NOT need to contain all fields, but DOES require to follow the user object format from the root
  // Example: to update the toggleable bot settings, we must pass a req.body = {
  //   botSettings: {
  //     toggle: {
  //       gtotMode: true
  //     }
  //   }
  // }
userRouter.patch('/', requireUser, async (req, res, next) => {
  try {
    let updatedUser = await updateUser(req.user.username, req.body);
    res.send({
      message: "user updated successfully",
      updatedUser
    });
  } catch (err) {
    console.log('error while updating user');
    next(err);
  }
})

export default userRouter;