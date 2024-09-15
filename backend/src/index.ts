import express from "express";
import mongoose from "mongoose";
import apiRouter from "./routes/api.route";
import hardcodePractices from "./hardcode_practices";

const app = express();
const PORT = 3001;

const hardcode = process.argv.includes("hardcode");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add api router
app.use("/api", apiRouter);

// connect to mongo, then start listening
mongoose
	.connect("mongodb://127.0.0.1:27017/hackwestx")
  .then(async () => {
    if (hardcode) {
      // hardcode practice words if user asks for it
      console.log("hardcoding words in DB...")
      await hardcodePractices();
    }
  })
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to MongoDB", error);
	});
