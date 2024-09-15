export interface wordRating {
	// sent from client
	_id: String;
	// TODO: update to 4 ratings
	rating: Number; // 0 - 3
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
