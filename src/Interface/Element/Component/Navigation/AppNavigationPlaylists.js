import CustomElement from '../../CustomElement';
import NavigationItemPlaylist from './NavigationItemPlaylist';

/**
 * List all playlists.
 *
 * @class
 */
class AppNavigationPlaylists extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'app-navigation-playlist';

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
        this.classList.add('app-navigation__playlists');

        this.api.manageUser().collection.fetchPlaylists().then((response) => 
        {
            this.subRenderPlaylists(response);
        });
    }

    /**
     * Renders the playlists.
     *
     * @protected
     *
     * @param {Object} response
     * Response from the back-end.
     */
    subRenderPlaylists(response)
    {
        var data = response.data || [];
        for (var playlist of data) {
            NavigationItemPlaylist.instantiate(playlist.title, `#user:${this.api.defaultUserId}/playlist:${playlist.id}`, playlist.id, this.api).attachTo(this);
        }
    }
}

AppNavigationPlaylists.register();

export default AppNavigationPlaylists;
