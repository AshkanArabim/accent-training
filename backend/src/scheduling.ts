import PracticeDB from './models/practice.model'
import { Practice } from './interfaces';

// implementation based on https://github.com/lo-tp/memory-scheduler/blob/master/index.js

export async function createPractice(word: string): Promise<Practice> {
	const practiceObj= {
		word: word,
		progress: 0,
		dueDate: new Date().toISOString(),
	};

	const mongoPracticeEntry = await PracticeDB.create(practiceObj);

	return mongoPracticeEntry;
}

// TODO: make this update the mongo database
export async function updatePractice(_id: string, now: Date, rating: number): Promise<Practice> {
	const practice = await PracticeDB.findById(_id)
	if (!practice) {
		throw Error("Practice with that ID not found!!")
	}

	const { progress, word } = practice
	
	const intervals = [1, 2, 3, 8, 17];
	// TODO: update this to 4 ratings
	const scroreToProgressChange = [-3, -1, 1];
	const msToDay = 60 * 60 * 24 * 1000;
	const maxProgress = intervals.length;
	const correct = rating === scroreToProgressChange.length - 1;

	// add n number of days to next practice
	const newProgress = progress + scroreToProgressChange[rating];
	let newDueDate = new Date(now.getTime() + 1 * msToDay);

	if (correct && progress < maxProgress) {
		newDueDate = new Date(now.getTime() + intervals[progress] * msToDay);
	}

	const newPracticeObj = await PracticeDB.findByIdAndUpdate(_id, {
		dueDate: newDueDate.toISOString(),
		progress: newProgress,
	}, { new: true });

	if (!newPracticeObj) {
		throw Error("Practice with that ID not found!!")
	}
	
	return newPracticeObj;
}
