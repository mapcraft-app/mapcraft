export default (json: Record<any, any>): Record<any, any> => {
	const ret = {};
	const isNumberRange = (data: Record<any, any>): Record<any, any> | undefined => {
		if (Object.prototype.hasOwnProperty.call(data, 'min') && Object.keys(data).length === 1)
			return { min: data['min'], max: data['min'] };
		else if (Object.prototype.hasOwnProperty.call(data, 'min') && Object.prototype.hasOwnProperty.call(data, 'max') && Object.keys(data).length === 2)
			return { min: data['min'], max: data['max'] };
		return undefined;
	};
	const clean = (data: Record<any, any>, json: Record<any, any>) => {
		for (const key in data) {
			if (
				data[key] === null || data[key] === undefined
				|| typeof data[key] === 'string' && !data[key].length
				|| data[key].constructor.name === 'Object' && !Object.keys(data[key]).length
				|| data[key].constructor.name === 'Array' && !data[key].length
			)
				continue;
			else if (data[key].constructor.name === 'Array') {
				json[key] = [];
				for (let i = 0; i < data[key].length; i++) {
					if (data[key][i].constructor.name === 'Object' && Object.keys(data[key][i]).length) {
						json[key].push({});
						clean(data[key][i], json[key][i]);
					} else if (data[key][i].constructor.name === 'Array' && !data[key][i].length) {
						json[key].push([]);
						clean(data[key][i], json[key][i]);
					} else if (data[key][i])
						json[key].push(data[key][i]);
				}
			} else if (data[key].constructor.name === 'Object') {
				const isRange = isNumberRange(data[key]);
				if (!isRange) {
					json[key] = {};
					clean(data[key], json[key]);
				} else
					json[key] = isRange;
			} else
				json[key] = data[key];
		}
	};

	clean(json, ret);
	return ret;
};
