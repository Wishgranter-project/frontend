import Api from './Api/Api';
import App from './Interface/Element/App.js';
import CreateElement from './Helper/CreateElement';

//----------------------------------------

HTMLElement.prototype.attach = function(element) { this.append(element); return element; };
HTMLElement.prototype.create = function(elementName, attributes = null, children = []) { return (new CreateElement(elementName, attributes, children)).create(); };
HTMLElement.prototype.createAndAttach = function(elementName, attributes = null, children = []) { return this.attach(this.create(elementName, attributes, children)); };
HTMLElement.prototype.clear = function() { var children = Array.from(this.children); for (var c of children) { c.remove(); } return this; }
URLSearchParams.prototype.without = function(name) { var newSearch = new URLSearchParams(this.toString()); newSearch.delete(name); return newSearch; }
URLSearchParams.prototype.withAdded = function(name, value) { var newSearch = new URLSearchParams(this.toString()); newSearch.append(name, value); return newSearch; }
URLSearchParams.prototype.isEmpty = function() { return this.toString().length == 0; }

//----------------------------------------

const api  = new Api(window.playerSettings.backEndBaseUrl);
window.api = api;
window.app = App.instantiate(api);

//----------------------------------------

document.addEventListener('DOMContentLoaded', () =>
{
    document.body.append(window.app);
});
