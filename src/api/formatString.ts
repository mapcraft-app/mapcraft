/**
 * Parse and replace variable(s) inside string
 * @param {string} str String to parse
 * @param {object} args arguments to replace inside {...}
 * @returns parsed string
 */
export default function formatString(str: string, args: Record<string, string> = {}): string {
	let ret = '';
	let occurenceKey = '';
	let occurences = 0;
	
	if (!str || Object.entries(args).length === 0)
		return str;
	for (let x = 0; x < str.length; x++) {
		if (str[x] === '{')
			++occurences;
		else if (str[x] === '}') {
			--occurences;
			if (occurences === 0) {
				const key = occurenceKey.slice(1);
				occurenceKey = '';
				if (Object.prototype.hasOwnProperty.call(args, key))
					ret += args[key];
				else
					ret += key;
				continue;
			}
		}
		if (occurences === 0)
			ret += str[x];
		else
			occurenceKey += str[x];
	}
	console.log(ret);
	return ret;
};
