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

triggerRaidEvent('jf2ue92u92mk@m5f8f@j5kl_WSmOS8%@@BzpAkmfmdiOQmb^_-85+DCJ_', '187093318');