import express from "express";

const router = express.Router();

// competency rating api
// receives: "good", "medium", "bad", "very bad"
router.put("/ratePractice", async (req, res) => {
	try {
		// TODO: update dummy logic
		return res.status(200).end();
	} catch (error: any) {
		const msg = `couldn't rate practice: ${error.message}`;
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
