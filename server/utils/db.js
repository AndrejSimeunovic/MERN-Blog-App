const { default: mongoose } = require("mongoose");

const db_connect = () => {
  const mongoDb = process.env.MONGO_DB_URI;
  mongoose.connect(mongoDb, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongo connection error"));
  db.once("open", () => console.log("DB connected"));
};

module.exports = db_connect;
