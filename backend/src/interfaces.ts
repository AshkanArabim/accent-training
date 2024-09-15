export interface wordRating {
	// sent from client
	word: String;
	// TODO: update to 4 ratings
	rating: Number; // 0 (awful), 1 (bad), 2(good)
}

export interface WordResponse {
	// sent to client
	word: String;
}

export interface Practice {
	_id: string;
	word: string;
	progress: number;
	dueDate: string;
}
