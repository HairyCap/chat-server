const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//allow cross-origin requests
app.use(cors());

//connect to mlab database
mongoose.connect(
  "mongodb://chatchat:chatchat1@ds149404.mlab.com:49404/chat-chat",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("connected to DB");
});

app.use(
  "/graphql",
  // cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(process.env.PORT || 4000, () => {
  console.log(
    `now listening for request on port ${process.env.PORT || "4000"}`
  );
});