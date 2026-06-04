import Api from 'wishgranter-sdk';
import App from './Interface/Element/App.js';
import CreateElement from './Helper/CreateElement';
import ModalLoginForm from './Interface/Element/Component/Modal/ModalLoginForm';

//----------------------------------------

// Extending vanila classes.
HTMLElement.prototype.attach = function(element) { if (element instanceof NodeList || Array.isArray(element)) { element.forEach((el) => { this.attach(el); }); return element; } if (element !== null) { this.append(element); } return element; };
HTMLElement.prototype.attachTo = function(element) { element.append(this); return this; };
HTMLElement.prototype.create = function(elementName, attributes = null, children = []) { return (new CreateElement(elementName, attributes, children)).create(); };
HTMLElement.prototype.createAndAttach = function(elementName, attributes = null, children = []) { return this.attach(this.create(elementName, attributes, children)); };
HTMLElement.prototype.clear = function() { var children = Array.from(this.children); for (var c of children) { c.remove(); } return this; }
HTMLElement.prototype.getAncestor = function(selector) { var element = this; while (element.parentNode) { if (element.matches(selector)) { return element; } element = element.parentNode; } return null; }
HTMLElement.prototype.addEventListeners = function(listeners) { for (var eventName of Object.keys(listeners)) { this.addEventListener(eventName, listeners[eventName]); } }
HTMLElement.prototype.addEventListenerOnce = function(key, eventName, callback) { var attribute = 'data-once-' + key; if (this.hasAttribute(attribute)) { return; } this.setAttribute(attribute, 'true'); this.addEventListener(eventName, callback); }
URLSearchParams.prototype.without = function(name) { var newSearch = new URLSearchParams(this.toString()); newSearch.delete(name); return newSearch; }
URLSearchParams.prototype.withAdded = function(name, value) { var newSearch = new URLSearchParams(this.toString()); newSearch.append(name, value); return newSearch; }
URLSearchParams.prototype.isEmpty = function() { return this.toString().length == 0; }
HTMLElement.prototype.index = function() { var array = Array.from(this.parentElement.childNodes); return array.indexOf(this); }

//----------------------------------------

const api  = new Api({ baseHref: window.playerSettings.backEndBaseUrl });
window.api = api;

//----------------------------------------

document.addEventListener('DOMContentLoaded', () =>
{
    api.session.fetch().then((response) => {
        if (response.meta.statusCode == 200) {
            window.app = App.instantiate(api, response.data.username);
            document.body.append(window.app);
        } else {
            const modal = ModalLoginForm.instantiate(api);
            document.body.append(modal);
        }
    });    
});
