import TwitchEmbedChat from "./TwitchEmbedChat/TwitchEmbedChat";
import FeatureDropDown from "./FeatureDropDown/FeatureDropDown";
import { Box, Typography, Divider } from "@mui/material";
function TestingArea () {

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: "center",
      textAlign: 'center'
    }}>
      <Typography variant="h5">Welcome to the Testing Grounds!</Typography>
      <Typography>If a feature is disabled below, it must be enabled in Account Settings before you are able to test it</Typography>
      <Divider sx={{
        borderColor: "lightgrey",
        width: '95%',
        mt: ".5rem",
        mb: "1rem"
      }}/>
      <FeatureDropDown />
      <TwitchEmbedChat />
    </Box>
  );
}

export default TestingArea;