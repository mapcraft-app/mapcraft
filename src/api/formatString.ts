export default function formatString(str: string, args: Record<string, unknown> | undefined): string {
	if (!str || str.length <= 0)
		return str;
	for (const char of str) {
		console.log(char);
		console.log('-');
	}
	console.log(args);
	return str;
};
