// opens connection to database
// connects to db before app runs
const mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;

mongodb.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    module.exports = client;
    const app = require("./server");
    app.listen(port, () => {
      console.log("Server running on port " + port);
    });
  }
);
