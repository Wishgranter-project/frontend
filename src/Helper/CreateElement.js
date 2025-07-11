/**
 * A helper class to instantiate DOM elements.
 */
class CreateElement
{
    /**
     * Constructor.
     *
     * @param {string} elementName
     * The element name.
     * @param {object} attributes
     * Attribute => Name key pairs.
     * @param {array} children
     * Array of DOM elements to append to the new element.
     * Useful to chain the creation of multiple elements.
     */
    constructor(elementName, attributes = null, children = [])
    {
        this.elementName = elementName;
        this.attributes = attributes;
        this.children = Array.isArray(children)
            ? children
            : [children];
    }

    /**
     * Instantiates the element.
     *
     * @returns {HTMLElement}
     * Ths instantiated element.
     */
    create()
    {
        var element = document.createElement(this.elementName);

        for (var attribute in this.attributes) {
            element.setAttribute(attribute, this.attributes[ attribute ]);
        }

        for (var child of this.children) {
            if (child == null) {
                continue;
            } else if (typeof child == 'string') {
                child = document.createTextNode(child);
            } else if (typeof child == 'object' && child.elementName) {
                child = CreateElement.createFromObject(child);
            }

            element.append(child);
        }

        return element;
    }

    /**
     * Creates an object from an object.
     * 
     * Given the properties: elementName, attributes and children.
     *
     * @param {object} obj
     * The object.
     *
     * @returns {HTMLElement}
     * The instantiated element.
     */
    static createFromObject(obj)
    {
        var { elementName, attributes, children } = obj;
        var create = new CreateElement(elementName, attributes, children);
        return create.create();
    }
}

export default CreateElement;
