import CustomElement          from '../CustomElement';

/**
 * Smart scroll.
 *
 * Provides a custom scroll bar that hides itself when not needed.
 *
 * @todo
 * Make scroll smoother. 
 * Make scroll speed depend on the clientHeight and scrollHeight.
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
        this.updateThumbPosition();
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

        this.$refs.thumb.style.height = thumbHeight + 'px';
    }

    updateThumbPosition()
    {
        var space = this.clientHeight - this.$refs.thumb.clientHeight;
        var mTop = Math.round((space / 100) * this.scrollPercentage);
        this.$refs.thumb.style.marginTop = mTop + 'px';
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

        var progress = 20; // pixels

        // scrollHeight
        // clientHeight
        // scrollTop
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
        this.$refs.bar.style.top = y + 'px';
        super.scrollTo(x, y);
    }

}

SmartScroll.register();

export default SmartScroll;
