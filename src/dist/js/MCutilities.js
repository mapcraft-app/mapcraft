class MCutilities
{
	static CheckIfStringIsLegalCharacter(string)
	{
		const Regex = new RegExp('[^-a-z0-9_\/.]+', 'gm');
		if (Regex.test(string))
			return (false);
		return (true);
	}
}

module.exports = MCutilities;
