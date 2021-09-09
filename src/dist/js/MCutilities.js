class MCutilities
{
	static CheckIfStringIsLegalCharacter(string)
	{
		const Regex = new RegExp('[^-a-z0-9_\/.]+', 'gm');
		if (Regex.test(string))
			return (false);
		return (true);
	}
	
	static GetNextCharacterInAlphabet(char) {
		return String.fromCharCode(char.charCodeAt(0) + 1);
	}
}

module.exports = MCutilities;
