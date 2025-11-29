import { Box, Button, Typography, Tooltip } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';

function DemoButton ({ buttonHandler, buttonText, tooltipText }) {

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      my: '.5rem'
    }}>
      <Button onClick={buttonHandler}>{buttonText}</Button>
      <Tooltip
        title={<Typography>{tooltipText}</Typography>}
        placement='top'
      >
        <HelpIcon />
      </Tooltip>
    </Box>
  );
}

export default DemoButton;