import CustomElement          from '../CustomElement';

/**
 * Smart scroll.
 *
 * Provides a custom scroll bar that hides itself when not needed.
 *
 * @class
 */
class SmartScroll extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'smart-scroll';

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('smart-scroll');
        this.$refs.bar = this.createAndAttach('div', {class: 'smart-scroll__bar'},
            this.$refs.thumb = this.createAndAttach('div', {class: 'smart-scroll__thumb'})
        );

        this.addEventListener('mouseover', this.onMouseOver.bind(this));
        this.addEventListener('mouseout', this.onMouseOut.bind(this));
        window.document.addEventListener('wheel', this.onWheel.bind(this));

        this.resizeObserver = new ResizeObserver((entries) => 
        {
            this.resized();
        });
        
        this.resizeObserver.observe(this);
    }

    resized()
    {
        this.updateThumbSize();
    }

    updateThumbSize()
    {
        var thumbHeight;
        const minThumbHeight = 20; // px
        const perc = (this.clientHeight / this.scrollHeight) * 100;
        thumbHeight = (this.clientHeight / 100) * perc;

        thumbHeight = thumbHeight < minThumbHeight
            ? minThumbHeight
            : thumbHeight;
    }

    updateThumbPosition()
    {
        this.$refs.thumb.style.height = thumbHeight + 'px';
    }

    onMouseOver(evt)
    {
        this.mouseOver = true;
    }

    onMouseOut(evt)
    {
        this.mouseOver = false;
    }

    get maxScrollTop()
    {
        return this.scrollHeight - this.clientHeight;
    }

    get scrollPercentage()
    {
        return (this.scrollTop / this.maxScrollTop) * 100;
    }

    onWheel(evt)
    {
        if (!this.mouseOver) {
            return;
        }

        if (this.clientHeight >= this.scrollHeight) {
            return
        }

        var { deltaY } = evt;
        const moveDown = deltaY > 0;
        const moveUp   = !moveDown;

        var newScrollTop, reachedBottom;

        // scrollHeight
        // clientHeight
        // scrollTop
        if (moveDown) {
            newScrollTop = this.scrollTop + 20;
            reachedBottom = newScrollTop >= this.maxScrollTop;

            newScrollTop = reachedBottom
                ? this.maxScrollTop
                : newScrollTop;

        } else if (moveUp) {
            newScrollTop = this.scrollTop - 20;
            newScrollTop = newScrollTop < 0
                ? 0
                : newScrollTop;
        }

        this.scrollTo(0, newScrollTop);
    }

    scrollTo(x, y)
    {
        this.$refs.bar.style.top = y + 'px';
        super.scrollTo(x, y);
    }

}

SmartScroll.register();

export default SmartScroll;
