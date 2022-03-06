const fs = require('fs');

class Drawing
{
	constructor(element)
	{
		this.els = {
			canvas: element.querySelector('.canvas'),
			size: element.querySelector('nav input[type="number"]'),
			reset: element.querySelector('nav button'),
		};
		this.size = this.els.size.value;
	}
}

module.exports = Drawing;
