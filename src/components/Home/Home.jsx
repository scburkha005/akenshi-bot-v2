import FeaturePreview from "./FeaturePreview/FeaturePreview";
import { Typography } from "@mui/material";

function Home () {

  return (
    <>
      <Typography variant='h4' sx={{mt: '1.2rem'}}>Thank You For Checking Out Akenshi Bot</Typography>
      <FeaturePreview />
    </>
  )
}

export default Home;