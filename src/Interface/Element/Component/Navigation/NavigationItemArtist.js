import NavigationItem from './NavigationItem';

/**
 * Artist navigation item.
 *
 * @class
 */
class NavigationItemArtist extends NavigationItem 
{
    /**
     * @inheritdoc
     */
    static elementName = 'navigation-item-artist';

    /**
     * Constructor.
     *
     * @param {String} label
     * Human-readable string.
     * @param {String} icon
     * Icon to accompany the label.
     * @param {String} href
     * URI.
     * @param {Integer} count
     * The number of playlist items the artist has in the collection.
     */
    __construct(label, icon, href, count)
    {
        super.__construct(label, icon, href);
        this.count = count;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        super.render();
        this.$refs.a.createAndAttach('span', {class: 'badge'}, this.count);
    }
}

NavigationItemArtist.register();

export default NavigationItemArtist;
