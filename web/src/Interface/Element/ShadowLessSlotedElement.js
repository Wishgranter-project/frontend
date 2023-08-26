class ShadowLessSlotedElement extends HTMLElement 
{
    constructor() 
    {
        super();
        this.slots = [];
    }

    render() 
    {
        this.innerHTML = 
        `<div class="first-frame">
            <slot></slot>
        </div>
        <div class="second-frame">
            <slot id="second-slot"></slot>
        </div>`;

        this.setupSlots();
        this.setupObserver();
    }

    connectedCallback() 
    {
        this.render();
    }

    setupSlots() 
    {
        this.querySelectorAll(':scope slot').forEach( (el) => 
        {
            var slot                = {};
            slot.id                 = el.getAttribute('id');
            slot.parentNode         = el.parentNode;
            slot.previousSibling    = el.previousSibling;
            slot.children           = [];
            this.slots.push(slot);

            el.remove();
        });
    }

    setupObserver() 
    {
        var config = { 
            childList   : true,
            attributes  : false,  
            subtree     : false 
        };

        this.observer = new MutationObserver( this.observer.bind(this) );
        this.observer.observe(this, config);
    }

    observer(mutationsList) 
    {
        mutationsList.forEach( (mutation) => 
        {
            mutation.addedNodes.forEach( (el) => 
            {
                this.onElementAdded(el);
            });
        });
    }

    onElementAdded(el) 
    {
        if (el.moved) {
            return;
        }

        for (var sl of this.slots) {
            if (! this.doesElementMatchSlot(sl, el)) {
                continue;
            }

            el.moved = true;
            this.appendToSlot(sl, el);
            break;
        }
    }

    doesElementMatchSlot(slot, element) 
    {
        if (element.constructor.name == 'Text') {
            return true;
        }

        var slotId = element.getAttribute('slot');

        return slotId == slot.id;
    }

    appendToSlot(slot, element) 
    {
        var appendTo    = slot.parentNode;
        var after       = null;
        var before      = null;

        if (slot.children.length) {
            after = slot.children[ slot.children.length - 1 ];
        } else if (slot.previousSibling) {
            after = slot.previousSibling;
        }

        before = after && after.nextSibling ? 
            after.nextSibling : 
            null;

        before ?
            appendTo.insertBefore(element, before) : 
            appendTo.append(element);

        slot.children.push(element);
    }
}

module.exports = ShadowLessSlotedElement;
