import express from "express";
import { createPractice, getNextPractice, updatePractice } from "../scheduling";

const router = express.Router();

// competency rating api
// receives: "good", "medium", "bad", "very bad"
router.put("/ratePractice", async (req, res) => {
	try {
		const { _id, rating } = req.body;
		if (_id == null || rating == null) {
			return res.status(400).json({ message: "Missing required fields" });
		}
		const newPractice = await updatePractice(_id, rating);
		return res.status(200).json(newPractice);
	} catch (error: any) {
		const msg = `Couldn't rate practice: ${error.message}`;
		console.log(msg);
		res.status(500).json({ message: msg });
	}
});

// practice fetch api
// sends: just a word

router.get("/nextPractice", async (req, res) => {
	try {
		const nextPractice = await getNextPractice();

		if (!nextPractice) {
			return res.status(404).json({ message: "no more practices left for today" });
		}

		return res.status(200).json(nextPractice);
	} catch (error: any) {
		const msg = `failed to get next word: ${error.message}`;
		console.log(msg);
		res.status(500).json({ message: msg });
	}
});

// only takes a word
router.get("/newPractice", async (req, res) => {
	try {
		const { word } = req.body;

		// TODO: this doesn't check if that word already exists
		const newPractice = await createPractice(word);

		return res.status(200).json(newPractice);
	} catch (error: any) {
		const msg = `failed to create new practice: ${error.message}`;
		console.log(msg);
		res.status(500).json({ message: msg });
	}
});

export default router;
