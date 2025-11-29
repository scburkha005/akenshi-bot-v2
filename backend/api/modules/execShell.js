import { exec } from 'node:child_process';
const { TWITCHCLI_RAID_PATH } = process.env;

export function triggerRaidEvent (secret, broadcasterId) {
  exec(`${TWITCHCLI_RAID_PATH} ${secret} ${broadcasterId}`, (error, stdout, stderr) => {
    if (error){
      console.log(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  });
}
