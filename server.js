const app = require("./app");

require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log("Server has been started");
});