import Api from './Api/Api';
import App from './Interface/Element/App.js';
import CreateElement from './Helper/CreateElement';

//----------------------------------------

// Extending.
HTMLElement.prototype.attach = function(element) { if (element instanceof NodeList || Array.isArray(element)) { element.forEach((el) => { this.attach(el); }); return element; } if (element !== null) { this.append(element); } return element; };
HTMLElement.prototype.attachTo = function(element) { element.append(this); return this; };
HTMLElement.prototype.create = function(elementName, attributes = null, children = []) { return (new CreateElement(elementName, attributes, children)).create(); };
HTMLElement.prototype.createAndAttach = function(elementName, attributes = null, children = []) { return this.attach(this.create(elementName, attributes, children)); };
HTMLElement.prototype.clear = function() { var children = Array.from(this.children); for (var c of children) { c.remove(); } return this; }
HTMLElement.prototype.getAncestor = function(selector) { var element = this; while (element.parentNode) { if (element.matches(selector)) { return element; } element = element.parentNode; } return null; }
HTMLElement.prototype.addEventListenerOnce = function(key, eventName, callback) { var attribute = 'data-once-' + key; if (this.hasAttribute(attribute)) { return; } this.setAttribute(attribute, 'true'); this.addEventListener(eventName, callback); }
URLSearchParams.prototype.without = function(name) { var newSearch = new URLSearchParams(this.toString()); newSearch.delete(name); return newSearch; }
URLSearchParams.prototype.withAdded = function(name, value) { var newSearch = new URLSearchParams(this.toString()); newSearch.append(name, value); return newSearch; }
URLSearchParams.prototype.isEmpty = function() { return this.toString().length == 0; }
HTMLElement.prototype.index = function() {
    var ar = Array.from(this.parentElement.childNodes);
    return ar.indexOf(this);
}

//----------------------------------------

const api  = new Api(window.playerSettings.backEndBaseUrl);
window.api = api;
window.app = App.instantiate(api);

//----------------------------------------

document.addEventListener('DOMContentLoaded', () =>
{
    document.body.append(window.app);
});
