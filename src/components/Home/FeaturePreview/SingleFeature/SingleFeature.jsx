import { Card, Typography, Divider, CardMedia, CardContent } from "@mui/material";
function SingleFeature ({ description, video, index, value }) {

  return (
    <>
      <Card sx={{
        display: index === value ? 'flex' : "none",
        width: { "desktop-l": '1088px', mobile: "100%" },
        height: '30rem',
      }}>
        <CardContent sx={{
          flexGrow: 1,
          width: '50%',
          alignContent: "center"
        }}>
          <Typography variant="h5">{description}</Typography> 
        </CardContent>
        <Divider orientation="vertical"></Divider>
        <CardMedia
          component="video"
          image={video}
          autoPlay
          loop
          sx={{
            flexGrow: 2,
            objectFit: "contain"
          }} />
      </Card>
    </>
  );
}

export default SingleFeature;