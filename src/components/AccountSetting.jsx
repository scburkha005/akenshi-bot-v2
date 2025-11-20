import { Box, FormControlLabel, Switch, IconButton, Typography } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useState } from "react";
function AccountSetting ({ setting, botToggleSettings, handleChange }) {
  const [infoOpen, setInfoOpen] = useState(false);
  
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
        <Typography>I am info</Typography>
      }
    </>
  );
}

export default AccountSetting;