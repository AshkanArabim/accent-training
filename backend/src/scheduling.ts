import PracticeDB from "./models/practice.model";
import { Practice } from "./interfaces";

// implementation based on https://github.com/lo-tp/memory-scheduler/blob/master/index.js

export async function createPractice(word: string): Promise<Practice> {
	const practiceObj = {
		word: word,
		progress: 0,
		dueDate: new Date().toISOString(),
	};

	const mongoPracticeEntry = await PracticeDB.create(practiceObj);

	return mongoPracticeEntry;
}

export async function updatePractice(_id: string, rating: number): Promise<Practice> {
	const practice = await PracticeDB.findById(_id);
	if (!practice) {
		throw Error("Practice with that ID not found!!");
	}
	
	const { progress, word } = practice;
	const dueDateString = practice.dueDate;
	let dueDate = new Date(dueDateString);
	
	const intervals = [1, 2, 3, 8, 17];
	const scroreToProgressChange = [-3, -1, 1, 3];
	const msToDay = 60 * 60 * 24 * 1000;
	const maxProgress = intervals.length;

	// bound rating between 0 and len(scoreToProgressChange)
	rating = Math.max((Math.min(rating, scroreToProgressChange.length)), 0)

	// add n number of days to next practice
	const newProgress = Math.max(Math.min(progress + scroreToProgressChange[rating], maxProgress), 0);
	const newDueDate = new Date(dueDate.getTime() + intervals[progress] * msToDay);

	const newPracticeObj = await PracticeDB.findByIdAndUpdate(
		_id,
		{
			dueDate: newDueDate.toISOString(),
			progress: newProgress,
		},
		{ new: true }
	);

	if (!newPracticeObj) {
		throw Error("Practice with that ID not found!!");
	}

	return newPracticeObj;
}

export async function getNextPractice() {
	const practice = await PracticeDB.findOne().sort({ dueDate: 1 });

	return practice;
}
