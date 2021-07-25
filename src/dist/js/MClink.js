class MClink
{
	constructor()
	{
		this._components = new Array();
	}
	addComponent(component)
	{
		if (component && this._components.indexOf(component) === -1)
			this._components.push(component);
	}
	removeComponent(component)
	{
		this._components.splice(this._components.indexOf(component), 1);
	}
	getComponents()
	{
		return (this._components);
	}
	cleanComponents()
	{
		delete this._components;
	}
}

var link = new MClink();

module.exports = link;
