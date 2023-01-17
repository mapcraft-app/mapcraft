export default (data: Record<any, any>): Record<any, any> => {
	const isNumberRange = (data: Record<any, any>): Record<any, any> | undefined => {
		if (typeof data === 'object') {
			if (Object.prototype.hasOwnProperty.call(data, 'min') && Object.keys(data).length === 1)
				return { min: data['min'], max: data['min'] };
			else if (Object.prototype.hasOwnProperty.call(data, 'min') && Object.prototype.hasOwnProperty.call(data, 'max') && Object.keys(data).length === 2)
				return { min: data['min'], max: data['max'] };
		}
		return undefined;
	};

	const analyse = (json: Record<any, any>) => {
		const ret: Record<any, any> = {};
		for (const key in json) {
			if (json[key] === undefined || json[key] === null)
				continue;
			else if (Array.isArray(json[key])) {
				json[key].forEach((e: any) => {
					ret[key] = analyse(e);
				});
			} else if (typeof json[key] === 'object')
				ret[key] = isNumberRange(json[key]) ?? analyse(json[key]);
			else
				ret[key] = json[key];
		}
		return ret;
	};

	return analyse(data);
};
