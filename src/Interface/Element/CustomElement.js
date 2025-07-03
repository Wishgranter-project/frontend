
/**
 * @class
 * @abstract
 */
class CustomElement extends HTMLElement
{
    /**
     * Custom constructor method.
     *
     * HTML elements do not receive parameters to their constructors.
     * So we are going to use this method to inject dependencies.
     *
     * Use the static instantiate() method to instantiate new elements.
     *
     * The parameters are implementation specific.
     *
     * @param {mixed} dependencies
     * Dependency.
     * @param {mixed} goHere
     * Go here.
     */
    __construct(dependencies = null, goHere = null)
    {
        // Implementation specific.

        /**
         * Wether the element is attached to the DOM or not.
         *
         * @type {Boolean}
         */
        this.attached = false;

        /**
         * A list of HTML elements that constitute the interface.
         *
         * For ease of access.
         *
         * @type {Object}
         */
        this.$refs = {};
    }

    /**
     * Part of the web components API.
     *
     * Called each time the element is added to the document.
     */
    connectedCallback()
    {
        if (this.attached) {
            return;
        }
        
        this.attached = true;
        this.renderLifeCycle();
    }

    /**
     * Causes the element to render again.
     */
    refresh()
    {
        this.clear();
        this.renderLifeCycle();
    }

    /**
     * Called before the rendering.
     *
     * @protected
     */
    beforeRender()
    {
    }

    /**
     * This method must not receive parameters.
     *
     * @protected
     */
    render()
    {
        this.innerHTML = 'inner html';
    }

    /**
     * Called after the rendering.
     *
     * @protected
     */
    afterRender()
    {
    }

    /**
     * The render life-cycle.
     *
     * @private
     */
    renderLifeCycle()
    {
        this.beforeRender();
        this.render();
        this.afterRender();
    }

    /**
     * Name of the custom element.
     *
     * @var {string}
     */
    static elementName = 'base-element';

    /**
     * Registers the element.
     */
    static register()
    {
        // Already registered ? do nothing.
        if (customElements.get(this.elementName)) {
            return;
        }

        // Register it.
        customElements.define(this.elementName, this);
    }

    /**
     * Instantiates a new instance of the custom element.
     *
     * @param {mixed} args
     * Will be passed to __construct()
     *
     * @returns {CustomElement}
     * New instance.
     */
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

    /**
     * Dispatches an event.
     *
     * Basically a shorthand for the vanilla dispatchEvent().
     *
     * @param {String} eventName
     * The name of the event.
     * @param {mixed} detail
     * Data to be added to the event.
     * @param {Boolean} bubbles
     * Wether the event bubles up the DOM tree.
     *
     * @returns {Boolean}
     * False if event is cancelable, and at least one of the event handlers
     * which received event called Event.preventDefault(). Otherwise true.
     */
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

    /**
     * Constructor.
     */
    constructor()
    {
        super();
    }
}

// Remember to register the element at the end of the document.
// CustomElement.register();

export default CustomElement;
