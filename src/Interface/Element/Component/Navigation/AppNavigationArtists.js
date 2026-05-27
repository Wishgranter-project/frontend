import CustomElement from '../../CustomElement';
import NavigationItemArtist from './NavigationItemArtist';

class AppNavigationArtists extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'app-navigation-artists';

    /**
     * Constructor.
     *
     * @param {Collection} collection
     * The user's collection.
     */
    __construct(collection)
    {
        super.__construct();
        this.collection = collection;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.clear();
        this.classList.add('app-navigation__artists');

        this.collection.artists.fetch().then((response) => 
        {
            for (var artist in response.data) {
                this.addArtistNavItem(artist, response.data[artist]);
            }
        });
    }

    /**
     * Adds an artist navigation item.
     *
     * @protected
     *
     * @param {String} artistName
     * Name of the artist.
     * @param {Integer} count
     * Number of items in the collection.
     */
    addArtistNavItem(artistName, count)
    {
        NavigationItemArtist.instantiate(artistName, null, '#search?artist=' + artistName, count).attachTo(this);
    }

}

AppNavigationArtists.register();

export default AppNavigationArtists;
