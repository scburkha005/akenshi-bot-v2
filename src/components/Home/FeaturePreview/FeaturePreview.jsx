import { Tab, Tabs, Box } from "@mui/material";
import SingleFeature from "./SingleFeature/SingleFeature";
import { useState } from "react";

const descriptionArr = [
  {
    description: "Automatically shouts out a user in chat when you receive a raid",
    video: "/static/autoShoutoutRaid.mp4"
  },
  {
    description: "Create your own personal list of users to receive automatic shoutouts the first time they type a message in your chat",
    video: "/static/autoShoutout.mp4"
  },
  {
    description: "Start a raffle to pick one random user from your chat",
    video: "/static/raffle.mp4"
  },
]
function FeaturePreview () {
  const [value, setValue] = useState(0);

  function handleChange (e, newVal) {
    setValue(newVal);
  }
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: "left", borderBottom: 1, borderColor: 'divider', mb: '.5rem', width: { "desktop-l": '1088px', mobile: "100%" }}}>
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
          <Tab label='Shoutout Raids' />
          <Tab label='Shoutout Users' />
          <Tab label='Raffle' />
        </Tabs>
      </Box>
      {descriptionArr.map((info, index) => {
        return <SingleFeature key={`${index}${value}`} description={info.description} video={info.video} index={index} value={value} />
      })}
    </>
  );
}

export default FeaturePreview;