const dotenv = require("dotenv");
const app = require("./app");
const { connectDB } = require("./config/db");
dotenv.config();

const PORT = process.env.PORT || 3000;

console.log('MONGO_URL =', process.env.MONGO_URL);

connectDB(process.env.MONGO_URL!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => console.error(err));
