import express from "express";
import bodyParser from "body-parser";
import User_ from "./routes/User_.mjs";

const app = express();
const port = 1113;

app.use(bodyParser.json());
app.use("/api/users", User_);

app.listen(port, () => console.log("Rest api listening at the 1113 port!!"));