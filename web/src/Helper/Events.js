class Events 
{
    static enableBottomReached(element) 
    {
        element.addEventListener('scroll', Events.onScroll.bind(element));
    }

    static onScroll(evt) 
    {
        if (this.scrollTop + this.offsetHeight >= this.scrollHeight) {
            this.dispatchEvent(new CustomEvent('scroll-bottom-reached', { bubbles: false }));
        }
    }
}

export default Events;
