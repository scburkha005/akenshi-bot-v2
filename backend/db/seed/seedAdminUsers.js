import { createAdminUser } from "../adapters/users.js";
import client from '../index.js';
import readline from 'node:readline';

const adminUser = {
  username: '',
  password: '',
  twitchUserId: '',
  twitchLogin: '',
  twitchDisplayName: '',
  userAccessToken: {
    token: '',
    refreshToken: ''
  },
  channelInfo: {
    moderators: []
  },
  botSettings: {
    toggle: {
      gtotMode: false,
      autoShoutout: false,
      autoShoutoutRaid: true,
      randomInsult: false
    },
    gtotModeEnabled: false,
    autoShoutout: [],
    scopes: [],
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Input username:", username => {
  adminUser.username = username;
  rl.question("Input password:", password => {
    adminUser.password = password;
    seedAdminUsers();
    rl.close();
  });
});


async function seedAdminUsers () {
  try {
    await createAdminUser(adminUser);
    await client.close();
  } catch (err) {
    console.log(err);
  }
}
