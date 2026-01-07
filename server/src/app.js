const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const ownerRoutes = require("./routes/owner");
const storeRoutes = require("./routes/stores");
const ratingRoutes = require("./routes/ratings");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [/localhost:\d+$/],
    credentials: false,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
