interface isoDate {
	year: number;
	month: number;
	day: number;
	hours: number;
	minutes: number;
	seconds: number;
	iso: string
}

const iso = {
	/**
	 * Get current UTC time into iso format
	 * @returns iso date
	 */
	now (): isoDate {
		const curDate = new Date();
		return {
			year: curDate.getUTCFullYear(),
			month: curDate.getUTCDate(),
			day: curDate.getUTCDay(),
			hours: curDate.getUTCHours(),
			minutes: curDate.getUTCMinutes(),
			seconds: curDate.getUTCSeconds(),
			iso: `${curDate.getUTCFullYear()}-${curDate.getUTCDate()}-${curDate.getUTCDay()}T${curDate.getUTCHours()}:${curDate.getUTCMinutes()}:${curDate.getUTCSeconds()}Z`
		} as isoDate;
	}
};

export default iso;
