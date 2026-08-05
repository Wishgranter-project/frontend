import CustomElement          from '../CustomElement';

/**
 * Smart scroll.
 *
 * Provides a custom scroll bar that hides itself when not needed.
 *
 * @todo
 * Make scroll smoother.
 * Make thumb draggable.
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
        window.document.addEventListener('wheel', this.onWheelRotated.bind(this));

        this.resizeObserver = new ResizeObserver((entries) => 
        {
            this.resized();
        });
        
        this.resizeObserver.observe(this);
    }

    /**
     * Returns how much we can scroll.
     *
     * @returns {Integer}
     * Pixels.
     */
    get maxScrollTop()
    {
        return this.scrollHeight - this.clientHeight;
    }

    /**
     * Returns how much the element has been scrolled.
     *
     * @returns {Float}
     * Percentage.
     */
    get scrollPercentage()
    {
        return (this.scrollTop / this.maxScrollTop) * 100;
    }

    resized()
    {
        this.updateThumbSize();
        this.updateThumbPosition();
    }

    /**
     * Updates the size of the thumb.
     *
     * @protected
     */
    updateThumbSize()
    {
        var thumbHeight;
        const minThumbHeight = 20; // px
        const perc = (this.clientHeight / this.scrollHeight) * 100;
        thumbHeight = (this.clientHeight / 100) * perc;

        thumbHeight = thumbHeight < minThumbHeight
            ? minThumbHeight
            : thumbHeight;

        this.$refs.thumb.style.height = thumbHeight + 'px';
    }

    /**
     * Updates the position of the thumb within the scroll bar.
     *
     * @protected
     */
    updateThumbPosition()
    {
        var space = this.clientHeight - this.$refs.thumb.clientHeight;
        var mTop = Math.round((space / 100) * this.scrollPercentage);
        this.$refs.thumb.style.marginTop = mTop + 'px';
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Mouse over event.
     */
    onMouseOver(evt)
    {
        this.mouseOver = true;
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Mouse out event.
     */
    onMouseOut(evt)
    {
        this.mouseOver = false;
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Wheel event.
     */
    onWheelRotated(evt)
    {
        if (!this.mouseOver) {
            return;
        }

        if (this.clientHeight >= this.scrollHeight) {
            return
        }

        var newScrollTop, reachedBottom;
        var { deltaY } = evt;
        const moveDown = deltaY > 0;
        const moveUp   = !moveDown;
        const notchLength = 120;

        deltaY = deltaY < 0
            ? deltaY * -1
            : deltaY;
        
        const notches = deltaY / notchLength;
        const progress = 20 * notches; // pixels.

        if (moveDown) {
            newScrollTop = this.scrollTop + progress;
            reachedBottom = newScrollTop >= this.maxScrollTop;

            newScrollTop = reachedBottom
                ? this.maxScrollTop
                : newScrollTop;

        } else if (moveUp) {
            newScrollTop = this.scrollTop - progress;
            newScrollTop = newScrollTop < 0
                ? 0
                : newScrollTop;
        }

        this.scrollTo(0, newScrollTop);
        this.updateThumbPosition();
    }

    scrollTo(x, y)
    {
        // Compesates for the content being scrolled, so the bar remains
        // fixed in position.
        this.$refs.bar.style.top = y + 'px';
        super.scrollTo(x, y);
    }
}

SmartScroll.register();

export default SmartScroll;
