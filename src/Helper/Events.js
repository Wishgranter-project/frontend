/**
 * A helper class to handle handle and fire custom events.
 *
 * @class
 */
class Events
{
    /**
     * Enables bottom reached event.
     *
     * Once we scroll to the bottom of the element, the scroll:bottom-reached
     * event is dispatched.
     *
     * @param {HTMLElement} element
     * The node to enable such event.
     */
    static enableBottomReached(element)
    {
        element.addEventListener('scroll', Events.onScroll.bind(element));
    }

    /**
     * Listener for the scroll event.
     *
     * Dispatches the scroll:bottom-reached event.
     * 
     * @param {Event} evt
     * The scroll event.
     */
    static onScroll(evt)
    {
        if (this.scrollTop + this.offsetHeight >= this.scrollHeight) {
            this.dispatchEvent(new CustomEvent('scroll:bottom-reached', { bubbles: false }));
        }
    }
}

export default Events;
