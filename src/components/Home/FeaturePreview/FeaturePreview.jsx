import { Tab, Tabs, Box, Divider } from "@mui/material";
import { useState } from "react";
function FeaturePreview () {
  const [value, setValue] = useState(0);

  function handleChange (e, newVal) {
    setValue(newVal);
  }
  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label='Feature One' />
        <Tab label='Feature One' />
        <Tab label='Feature One' />
      </Tabs>
      <Divider sx={{ width: '100%'}}></Divider>
      <Box sx={{
        display: 'flex',
        width: '100%'
      }}>
        <Box sx={{
          flexGrow: 1,
          // flexBasis: "auto"
        }}>Description here</Box>
        <Box sx={{
          flexGrow: 2,
          // flexBasis: "auto"
        }}>Photo here</Box>
      </Box>
    </>
  );
}

export default FeaturePreview;