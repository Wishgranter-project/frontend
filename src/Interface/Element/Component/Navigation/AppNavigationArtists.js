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
     * @param {Api} api
     * Api to communicate with the backend.
     */
    __construct(api)
    {
        super.__construct();
        this.api = api;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.clear();
        this.classList.add('app-navigation__artists');

        this.api.manageUser().collection.artists.fetch().then((response) => 
        {
            for (var artist in response.data) {
                NavigationItemArtist.instantiate(artist, `#user:${this.defaultUserId}/search?artist=${artist}`, response.data[artist]).attachTo(this);
            }
        });
    }

}

AppNavigationArtists.register();

export default AppNavigationArtists;
