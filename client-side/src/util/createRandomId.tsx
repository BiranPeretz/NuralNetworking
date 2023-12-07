const createRandomId = function (): string {
	return Math.random().toString(36).slice(2, 10);
};

export default createRandomId;
