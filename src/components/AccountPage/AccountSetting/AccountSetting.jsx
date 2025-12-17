import { Box, FormControlLabel, Switch, IconButton, Typography, Paper, Card, Divider } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useState } from "react";
function AccountSetting ({ settingName, setting, handleChange }) {
  const [infoOpen, setInfoOpen] = useState(false);
  const settingsInfo = {
    gtotMode: [
      {
        text:`When enabled, akenshi bot will have the ability to enter and exit gtot mode.`,
        style: {
          pb: '.4rem',
          pl: '.4rem'
        }
      },
      {
        text: `To toggle gtot mode, type "enter gtot mode" or "exit gtot mode" in your twitch chat.`,
        style: {
          pl: '.4rem',
          fontWeight: "bold"
        },
        variant: 'body2'
      }
    ],
    autoShoutout: [
      {
        text: `Add twitch display names of people to the Auto Shoutout Settings that you would like to receive automatic shout outs`,
        style: {
          pl: '.4rem',
        }
      }
    ],
    autoShoutoutRaid: [
      {
        text: `No additional steps needed`,
        style: {
          pl: ".4rem"
        }
      }
    ],
    randomInsult: [
      {
        text: `No additional steps needed`,
        style: {
          pl: ".4rem"
        }
      }
    ],
    raffle: [
      {
        text: `When enabled, akenshi bot will have the ability to start raffles/lotteries to pick a user`,
        style: {
          pb: '.4rem',
          pl: '.4rem'
        }
      },
      {
        text: `To start a raffle/lottery, type "!startlottery" in your twitch chat`,
        style: {
          pl: '.4rem',
          fontWeight: 'bold'
        },
        variant: 'body2'
      }
    ]
  }

  const settingsInfoBulletPoints = {
    gtotMode: [
      {
        text: `All shoutouts will instead be replaced with "Yo shoutout my dawg USER"`,
        style: {
          pt: 1,
          ml: '1.5rem',
        },
      },
      {
        text: `On every user message, there is a one percent chance akenshi bot will respond with "ya mama"`,
        style: {
          ml: '1.5rem'
        },
      }
    ],
    autoShoutout: [
      {
        text: `Users added to the list of names in the Auto Shoutout Settings will be automatically shouted out`,
        style: {
          pt: 1,
          ml: '1.5rem'
        }
      },
      {
        text: `The first time (per day) that a user from the list types in your chat each day, they will be given a shout out`,
        style: {
          ml: '1.5rem'
        }
      }
    ],
    autoShoutoutRaid: [
      {
        text: `Upon receiving raid, akenshi bot will automatically send a message in the chat shouting out the twitch user who sent the raid and what game they were playing`,
        style: {
          ml: '1.5rem'
        }
      },
      {
        text: `Upon receiving raid, will trigger a twitch shoutout to make it easier for users to follow the twitch user who sent the raid`,
        style: {
          ml: '1.5rem'
        }
      }
    ],
    randomInsult: [
      {
        text: `This is an experimental feature that utilizes an LLM to generate random insults`,
        style: {
          ml: '1.5rem'
        }
      },
      {
        text: `On every user message, there is a 1/250 chance that a random insult will be generated in response to and based off of the contents of the user's message`,
        style: {
          ml: '1.5rem'
        }
      }
    ],
    raffle: [
      {
        text: `After starting a lottery, a 30 second timer will start during which user entries will be collected`,
        style: {
          ml: '1.5rem'
        }
      },
      {
        text: `After the 30 seconds are over, a random user of those who entered will be selected and announced in chat`,
        style: {
          ml: '1.5rem'
        }
      }
    ]
  }
  
  function handleInfoClick () {
    setInfoOpen(!infoOpen);
  }
  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <FormControlLabel 
          control={
            <Switch checked={setting.enabled} onChange={handleChange} name={settingName} />
          }
          label={settingName}
        />
        <IconButton onClick={handleInfoClick} sx={{
          ':focus': {
            outline: "none"
          }
        }}>
          <InfoOutlineIcon />
        </IconButton>
      </Box>
      { infoOpen && 
        <Paper variant="outlined" sx={{
          px: '1rem',
          pt: '.5rem',
          pb: '1rem'
        }}>
          <Typography variant="overline">How to use:</Typography>
          {settingsInfo[settingName].map(data => <Typography variant={data.variant ? data.variant : 'body1'} sx={data.style}>{data.text}</Typography>)}
          <Divider sx={{ my: '.6rem' }}></Divider>
          <Typography variant="overline">What changes: </Typography>
          {settingsInfoBulletPoints[settingName].map(data => <Typography component={'li'} sx={data.style}>{data.text}</Typography>)}
        </Paper>
      }
    </>
  );
}

export default AccountSetting;