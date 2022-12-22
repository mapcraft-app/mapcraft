export default function(length = 16): string {
	const chars = '0123456789abcdef';
	let str = '';
	for (let i = 0; i < length; i++)
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	return str;
}
