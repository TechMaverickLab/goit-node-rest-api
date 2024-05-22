const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

const contactsRouter = require("./routes/contacts");
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
