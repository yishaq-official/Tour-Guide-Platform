import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.config.js";

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    connectDB();
});