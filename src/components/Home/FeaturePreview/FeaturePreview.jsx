import { Tab, Tabs, Box } from "@mui/material";
import SingleFeature from "./SingleFeature/SingleFeature";
import { useState } from "react";

const descriptionArr = [
  {
    description: "description 1",
    video: "/static/autoShoutoutRaid.mp4"
  },
  {
    description: "description 2",
    video: "/static/autoShoutout.mp4"
  },
  {
    description: "description 3",
    video: "/static/raffle.mp4"
  },
  {
    description: "description 4",
    video: "video link"
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
          <Tab label='Feature One' />
          <Tab label='Feature One' />
          <Tab label='Feature One' />
          <Tab label='Feature One' />
          <Tab label='Feature One' />
          <Tab label='Feature One' />
          <Tab label='Feature One' />
        </Tabs>
      </Box>
      {descriptionArr.map((info, index) => {
        return <SingleFeature key={`${index}${value}`} description={info.description} video={info.video} index={index} value={value} />
      })}
    </>
  );
}

export default FeaturePreview;