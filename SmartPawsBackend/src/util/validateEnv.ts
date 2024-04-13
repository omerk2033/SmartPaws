import { cleanEnv, port, str } from "envalid";


export default cleanEnv(process.env, {
  MONGODB_CONNECTION_STRING: str(),
  PORT: port(),
})