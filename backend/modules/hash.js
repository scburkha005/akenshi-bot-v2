import bcrypt from "bcryptjs";
const SALTROUNDS = 10;

export async function hashPassword (password) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALTROUNDS);
    return hashedPassword;
  } catch (err) {
    console.log('error while hashing password');
    console.log(err);
  }
}

export async function verifyPassword (password, storedHash) {
  try {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  } catch (err) {
    console.log("error while verifying password");
    console.log(err);
  }
}