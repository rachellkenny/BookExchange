// opens connection to database
// connects to db before app runs
const mongodb = require("mongodb");
const port = process.env.PORT || 3000;

const connectionString =
  "mongodb+srv://rkenny:rkenny@webapp-fwa0k.mongodb.net/BookExchange?retryWrites=true&w=majority";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    module.exports = client;
    const app = require("./server");
    app.listen(3000, () => {
      console.log("Server running on port " + port);
    });
  }
);
