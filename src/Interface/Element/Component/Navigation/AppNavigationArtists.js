import CustomElement from '../../CustomElement';
import NavigationItemArtist from './NavigationItemArtist';

class AppNavigationArtists extends CustomElement
{
    /** @inheritdoc */
    static elementName = 'app-navigation-artists';

    /**
     * Constructor.
     *
     * @param {Api} api
     * Api to communicate with the backend.
     * @param {String} userId
     * The current user's id.
     */
    __construct(api, userId)
    {
        super.__construct();
        this.api = api;
        this.userId = userId;
    }

    /** @inheritdoc */
    render()
    {
        this.clear();
        this.classList.add('app-navigation__artists');

        this.api.manageUser(this.userId).collection.artists.fetch().then((response) => 
        {
            for (var artist in response.data) {
                NavigationItemArtist.instantiate(artist, null, `#user:${this.userId}/search?artist=${artist}`, response.data[artist]).attachTo(this);
            }
        });
    }

}

AppNavigationArtists.register();

export default AppNavigationArtists;
