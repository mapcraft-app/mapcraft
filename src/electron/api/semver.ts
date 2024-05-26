/**
 * Compare semver
 * @param oldVersion string
 * @param newVersion string
 * @returns -1 if newVersion is lesser than oldVersion, 0 if equal, 1 is upper
 */
export default (oldVersion: string, newVersion: string): number => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ret = (comp: boolean) => <number><any>comp | 0;
	const data = {
		old: oldVersion.indexOf('-') !== -1
			? oldVersion.split('-')
			: oldVersion,
		new: newVersion.indexOf('-') !== -1
			? newVersion.split('-')
			: newVersion,
	};

	if (Array.isArray(data.old) !== Array.isArray(data.new))
		return ret(Array.isArray(data.old));
	if (Array.isArray(data.old) && Array.isArray(data.new)) {
		const preRelease = data.new[1].localeCompare(data.old[1]);
		return preRelease === 0
			? data.new[0].localeCompare(data.old[0], undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' })
			: preRelease;
	}
	return (data.new as string).localeCompare(data.old as string, undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' });
};
