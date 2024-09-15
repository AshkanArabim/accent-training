import express from "express";
import { createPractice, updatePractice } from "../scheduling";

const router = express.Router();

// competency rating api
// receives: "good", "medium", "bad", "very bad"
router.put("/ratePractice", async (req, res) => {
  try {
    const { _id, rating } = req.body;
    if (!_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newPractice = await updatePractice(_id, new Date(), rating)
    return res.status(200).json(newPractice);
  } catch (error: any) {
    const msg = `Couldn't rate practice: ${error.message}`;
    console.log(msg);
    res.status(500).json({ message: msg });
  }
});

// practice fetch api
// sends: just a word

router.get("/nextPracticeWord", async (req, res) => {
	try {
		// TODO:
		return res.status(200).json({ word: "dummy" });
	} catch (error: any) {
		const msg = `failed to get next word: ${error.message}`;
		console.log(msg);
		res.status(500).json({ message: msg });
	}
});

export default router;
