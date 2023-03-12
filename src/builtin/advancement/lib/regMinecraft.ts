const regex = /^minecraft:(.*)$/m;

export const getter = (str: string, addMinecraft = true): string => {
	const data = regex.exec(str);
	let temp = (data && data.length > 0)
		? data[1]
		: str;
	temp = temp.toLowerCase().replaceAll(/[^a-z0-9/._-]/g, '_');
	if (addMinecraft)
		return `minecraft:${temp}`;
	return temp;
};

export const setter = (str: string | null): string | null => {
	if (!str)
		return null;
	const reg = regex.exec(str);
	if (reg && reg.length > 0)
		return reg[1];
	return str;
};
