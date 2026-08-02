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
     * @param {String} artistName
     * Human-readable string.
     * @param {String} href
     * URI.
     * @param {Integer} count
     * The number of playlist items the artist has in the collection.
     */
    __construct(artistName, href, count)
    {
        super.__construct(artistName, href, 'Songs by ' + artistName, null);
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
