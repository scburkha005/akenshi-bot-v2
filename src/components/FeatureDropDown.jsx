import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AuthContext } from "../App";
import { useContext, useState } from "react";

function FeatureDropDown () {
  const { user } = useContext(AuthContext);
  const [selectedFeature, setSelectedFeature] = useState('')

  function handleChange (e) {
    setSelectedFeature(e.target.value)
  }

  return (
    <FormControl fullWidth sx={{
      maxWidth: '320px'
    }}>
      <InputLabel>Feature</InputLabel>
      <Select
        value={selectedFeature}
        onChange={handleChange}
      >
        {user.botSettings?.toggle && Object.keys(user.botSettings.toggle).map((featureName) => {
          return <MenuItem value={featureName}>{featureName}</MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

export default FeatureDropDown;