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
     * {@inheritdoc}
     */
    static elementName = 'app-navigation-playlist';

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
     * {@inheritdoc}
     */
    render()
    {
        this.clear();
        this.classList.add('app-navigation__playlists');

        this.collection.fetchPlaylists().then((response) => 
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
            NavigationItemPlaylist.instantiate(playlist.title, null, `#playlist:${playlist.id}`, playlist.id, this.collection).attachTo(this);
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
            this.fireEvent('collection:intention:compose-new-playlist');
        });

        this.$refs.downloadPlaylists.addEventListener('click', () =>
        {
            this.fireEvent('collection:intention:download');
        });
    }
}

AppNavigationPlaylists.register();

export default AppNavigationPlaylists;
