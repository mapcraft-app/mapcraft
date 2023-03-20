export interface isoDate {
	year: number;
	month: number;
	day: number;
	hours: number;
	minutes: number;
	seconds: number;
	iso: string
}

export enum isoCompare {
	LESS = -1, SAME = 0, GREATER = 1 // eslint-disable-line no-unused-vars
}

const iso = {
	/**
	 * Get current UTC time into iso format
	 */
	now(): isoDate {
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
	},

	/**
	 * Generate filename with iso date
	 */
	filenameFormat(): string {
		return this.now().iso.replaceAll(/[-:]/g, '_');
	},

	/**
	 * Compare two iso date
	 * @param oldDate
	 * @param newDate
	 */
	compare(oldDate: isoDate, newDate: isoDate): isoCompare {
		let diff = 0;
		const check = (o: number, n: number) => {
			diff = n - o;
		};
		const ret = () => {
			if (diff < 0)
				return isoCompare.LESS;
			if (diff > 0)
				return isoCompare.GREATER;
			return isoCompare.SAME;
		};

		check(oldDate.year, newDate.year);
		if (diff !== 0)
			return ret();
		check(oldDate.month, newDate.month);
		if (diff !== 0)
			return ret();
		check(oldDate.day, newDate.day);
		if (diff !== 0)
			return ret();
		check(oldDate.hours, newDate.hours);
		if (diff !== 0)
			return ret();
		check(oldDate.minutes, newDate.minutes);
		if (diff !== 0)
			return ret();
		check(oldDate.seconds, newDate.seconds);
		return ret();
	}
};

export default iso;
