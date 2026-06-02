import CustomElement from '../../CustomElement';

/**
 * An item for the navigation menu.
 *
 * @class
 */
class NavigationItem extends CustomElement
{
    /** @inheritdoc */
    static elementName = 'navigation-item';

    /**
     * Constructor.
     *
     * @param {String} label
     * Human-readable label.
     * @param {String} icon
     * Icon to accompany the label, optional.
     * @param {String} href
     * URI for the item.
     * @param {String} tittleAttr
     * To be used in the tab.
     * @param {String} toolTip
     * Text to apper when hovering, optional.
     */
    __construct(label, icon, href, tittleAttr = null, toolTip = null)
    {
        super.__construct();
        this.label       = label;
        this.icon        = icon;
        this.href        = href;
        this.tittleAttr  = tittleAttr;
        this.toolTip     = toolTip;
    }

    /** @inheritdoc */
    render()
    {
        this.classList.add('app-navigation__item');

        var attrs = {};

        if (this.tittleAttr) {
            attrs['data-tabbed-router-title'] = this.tittleAttr;
        }
        
        if (this.toolTip != null && this.toolTip != 'null') {
            attrs.title = this.toolTip;
        }

        if (this.href) {
            attrs.href = this.href;
        }

        this.$refs.a = this.createAndAttach('a', attrs);

        this.$refs.a.attach([
            (this.icon ? this.create('span', {class: 'fa ' + this.icon}) : null),
            this.create('span', {class: 'label ellipsis'}, this.label)
        ]);
    }
}

NavigationItem.register();

export default NavigationItem;
