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
            this.subRenderCreateAndDownload();
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
            NavigationItemPlaylist.instantiate(playlist.title, null, `#user:${this.api.defaultUserId}/playlist:${playlist.id}`, playlist.id, this.api).attachTo(this);
        }
    }

    /**
     * Renders the buttons.
     *
     * Create new playlist and download the existing ones.
     */
    subRenderCreateAndDownload()
    {
        this.createAndAttach('div', {class: 'input-group input-group-horizontal'}, [
            this.$refs.createPlaylist    = this.create('button', {title: 'Create playlist'}, this.create('span', {class: 'fa fa-plus-circle'})),
            this.$refs.downloadPlaylists = this.create('button', {title: 'Download entire collection'}, this.create('span', {class: 'fa fa-download'}))
        ]);

        this.$refs.createPlaylist.addEventListener('click', () =>
        {
            this.fireEvent('playlist:intention:compose-new');
        });

        this.$refs.downloadPlaylists.addEventListener('click', () =>
        {
            this.fireEvent('collection:intention:download');
        });
    }
}

AppNavigationPlaylists.register();

export default AppNavigationPlaylists;
