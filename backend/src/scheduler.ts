// implementation based on https://github.com/lo-tp/memory-scheduler/blob/master/index.js
interface Practice {
	word: string;
	progress: number;
	dueDate: string;
}

export function createPractice(word: string): Practice {
	return {
		word: word,
		progress: 0,
		dueDate: new Date().toISOString(),
	};
}

export function updatePractice({ word, progress }: Practice, now: Date, s: number): Practice {
	const intervals = [1, 2, 3, 8, 17];
	const scroreToProgressChange = [-3, -1, 1];
	const msToDay = 60 * 60 * 24 * 1000;
	const maxProgress = intervals.length;
	const correct = s === scroreToProgressChange.length - 1;

	// add n number of days to next practice
	const newProgress = progress + scroreToProgressChange[s];
	let newDueDate = new Date(now.getTime() + 1 * msToDay);

	if (correct && progress < maxProgress) {
		newDueDate = new Date(now.getTime() + intervals[progress] * msToDay);
	}

	return {
		word: word,
		progress: newProgress < 0 ? 0 : newProgress,
		dueDate: newDueDate.toISOString(),
	};
}
