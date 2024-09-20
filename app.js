require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors=require('cors')

const useRouter = require("./routes/user");
const app = express();
const PORT = 7000;
app.use(cors())
app.use(express.json());

app.use(useRouter);

app.listen(process.env.PORT || 7000, () => {
  console.log(`served running on localhost:${PORT}`);
});
const MONGO_Url =
`mongodb+srv://vickymlucky:${process.env.MONGODB_PASSWORD}@cluster0.xaqfsym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(MONGO_Url);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to db"));
