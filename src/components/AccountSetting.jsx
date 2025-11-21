import { Box, FormControlLabel, Switch, IconButton, Typography, Paper, Card, Divider } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useState } from "react";
function AccountSetting ({ setting, botToggleSettings, handleChange }) {
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
          pb: '.4rem',
          pl: '.4rem',
          fontWeight: "bold"
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
          ml: 3,
        },
      },
      {
        text: `On every user message, there is a one percent chance akenshi bot will respond with "ya mama"`,
        style: {
          ml: 3,
        },
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
            <Switch checked={botToggleSettings[setting]} onChange={handleChange} name={setting} />
          }
          label={setting}
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
          px: 2,
          py: 1
        }}>
          <Typography variant="overline">How to use:</Typography>
          {settingsInfo[setting].map(data => <Typography variant={data.variant ? data.variant : 'body1'} sx={data.style}>{data.text}</Typography>)}
          <Divider></Divider>
          <Typography variant="overline" sx={{ pt: '.5rem' }}>What changes: </Typography>
          {settingsInfoBulletPoints[setting].map(data => <Typography component={'li'} sx={data.style}>{data.text}</Typography>)}
        </Paper>
      }
    </>
  );
}

export default AccountSetting;