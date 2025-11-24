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
      <InputLabel id='feature-dropdown-label'>Feature</InputLabel>
      <Select
        labelId='feature-dropdown-label'
        value={selectedFeature}
        onChange={handleChange}
        label="Feature"
      >
        {user.botSettings?.toggle && Object.keys(user.botSettings.toggle).map((featureName) => {
          return user.botSettings.toggle[featureName] ? <MenuItem value={featureName}>{featureName}</MenuItem> : <MenuItem disabled value={featureName}>{featureName}</MenuItem>
        })}
      </Select>
    </FormControl>
  );
}

export default FeatureDropDown;