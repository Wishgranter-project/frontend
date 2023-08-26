class CreateElement 
{
    constructor(elementName, attributes = null, children = []) 
    {
        this.elementName = elementName;
        this.attributes = attributes;
        this.children = Array.isArray(children)
            ? children
            : [children];
    }

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

    static createFromObject(obj) 
    {
        var { elementName, attributes, children } = obj;
        var create = new CreateElement(elementName, attributes, children);
        return create.create();
    }
}

export default CreateElement;
