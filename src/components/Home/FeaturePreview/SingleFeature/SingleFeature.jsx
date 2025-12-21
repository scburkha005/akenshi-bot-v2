import { Card, Box, Divider } from "@mui/material";
function SingleFeature ({ description, video, index, value }) {

  return (
    <>
      <Card sx={{
        display: index === value ? 'flex' : "none",
        width: '100%',
        height: '10rem'
      }}>
        <Box sx={{
          flexGrow: 1,
        }}>{description}</Box>
        <Divider orientation="vertical"></Divider>
        <Box sx={{
          flexGrow: 2.5,
        }}>{video}</Box>
      </Card>
    </>
  );
}

export default SingleFeature;