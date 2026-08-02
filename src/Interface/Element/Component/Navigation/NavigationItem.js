import CustomElement from '../../CustomElement';

/**
 * An item for the navigation menu.
 *
 * @class
 */
class NavigationItem extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'navigation-item';

    /**
     * Constructor.
     *
     * @param {String} label
     * Human-readable label.
     * @param {String} href
     * URI for the item.
     * @param {String} tittleAttr
     * To be used in the tab.
     * @param {String} toolTip
     * Text to apper when hovering, optional.
     * @param {String} icon
     * Icon to accompany the label, optional.
     */
    __construct(label, href, tittleAttr = null, toolTip = null, icon = null)
    {
        super.__construct();
        this.label       = label;
        this.href        = href;
        this.tittleAttr  = tittleAttr;
        this.toolTip     = toolTip;
        this.icon        = icon;
    }

    /**
     * @inheritdoc
     */
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
