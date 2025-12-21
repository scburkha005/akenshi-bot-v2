import { Tab, Tabs, Box, Divider, Card } from "@mui/material";
import { useState } from "react";
function FeaturePreview () {
  const [value, setValue] = useState(0);

  function handleChange (e, newVal) {
    setValue(newVal);
  }
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: "left", borderBottom: 1, borderColor: 'divider', mb: '.5rem', width: "100%" }}>
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
      <Card sx={{
        display: 'flex',
        width: '100%',
        height: '10rem'
      }}>
        <Box sx={{
          flexGrow: 1,
        }}>Description here</Box>
        <Divider orientation="vertical"></Divider>
        <Box sx={{
          flexGrow: 2.5,
        }}>Video here</Box>
      </Card>
    </>
  );
}

export default FeaturePreview;