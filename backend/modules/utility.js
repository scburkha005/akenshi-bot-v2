export const flattenObject = (obj, currentPath = '', flatObj = {}) => {
  let currentDepthKeys = Object.keys(obj);
  currentDepthKeys.forEach(key => {
    let currValue = obj[key]
    // Will only run if the key's value is an object
    if (typeof currValue === 'object' && !Array.isArray(currValue)) {
      flattenObject(currValue, `${currentPath}.${key}`, flatObj);
    } else {
      flatObj[`${currentPath}.${key}`.slice(1)] = currValue;
    }
  });
  return flatObj;
}