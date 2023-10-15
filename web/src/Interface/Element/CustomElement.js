
class CustomElement extends HTMLElement 
{
    __construct(dependencies = null, goHere = null) 
    {
        // this is the proper constructor, as 
        // html elements don't receive parameters 
        // to the actual constructor.
    }

    beforeRender() 
    {

    }

    /**
     * This method must not receive parameters.
     */
    render() 
    {
        this.innerHTML = 'inner html';
    }

    afterRender() 
    {
        
    }

    refresh() 
    {
        this.clear();
        this.renderLifeCycle();
    }

    renderLifeCycle() 
    {
        this.beforeRender();
        this.render();
        this.afterRender();
    }

    connectedCallback() 
    {
        if (!this.attached) {
            this.attached = true;
            this.renderLifeCycle();
        }
    }

    once(name, event, listener) 
    {
        var attributeName = 'data-once-' + name;

        if (this.hasAttribute(attributeName)) {
            return;
        }

        this.setAttribute(attributeName, '1');

        this.addEventListener(event, listener);
    }

    static elementName = 'base-element';

    static register() 
    {
        // Already registered ?
        if (customElements.get(this.elementName)) {
            return; // do nothing.
        }

        // Register it.
        customElements.define(this.elementName, this);
    }

    static instantiate(...args) 
    {
        // Friendly reminder to register the element before creating an instance.
        if (! customElements.get(this.elementName)) {
            throw `Register this garbage <${this.elementName}> damn you, you forgot to register it! Call .register() !!`;
        }

        var el = document.createElement(this.elementName);
        el.__construct(...args);
        return el;
    }

    fireEvent(eventName, detail = null, bubbles = true)
    {
        var options = {
            bubbles
        };

        if (detail != null) {
            options.detail = detail;
        }

        var event = new CustomEvent(eventName, options);

        return this.dispatchEvent(event);
    }

    constructor() {
        super();
        this.$refs = {};
        this.attached = false;
    }
}

// Remember to register the element at the end of the document.
// CustomElement.register();
export default CustomElement;
