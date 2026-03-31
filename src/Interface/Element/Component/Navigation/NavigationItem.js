import CustomElement from '../../CustomElement';

/**
 * A navigation item.
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
     * Human-readable string.
     * @param {String} icon
     * Icon to accompany the label.
     * @param {String} href
     * URI.
     * @param {String} tittleAttr
     * Tooltip to apper when hovering, optional.
     */
    __construct(label, icon, href, tittleAttr = null)
    {
        super.__construct();
        this.label       = label;
        this.icon        = icon;
        this.href        = href;
        this.tittleAttr  = tittleAttr;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('app-navigation__item');

        var attrs = this.tittleAttr == null || this.tittleAttr == 'null'
            ? {}
            : { title: this.tittleAttr };

        if (this.href) {
            attrs.href = this.href;
        }

        this.$refs.a = this.createAndAttach('a', attrs);

        var icon = this.icon
            ? this.create('span', {class: 'fa ' + this.icon})
            : null;

        var label = this.create('span', {class: 'label ellipsis'}, this.label);

        this.$refs.a.attach([icon, label]);
    }
}

NavigationItem.register();

export default NavigationItem;
