import CustomElement from '../../CustomElement';
import NavigationItemPlaylist from './NavigationItemPlaylist';

class AppNavigationPlaylists extends CustomElement 
{
    static elementName = 'app-navigation-playlist';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.clear();
        this.classList.add('app-navigation__playlists');

        this.api.collection.playlists.list().then((response) => 
        {
            this.subRenderPlaylists(response);
            this.subRenderCreateAndDownload();
        });
    }

    subRenderPlaylists(response)
    {
        var data = response.data || [];
        for (var playlist of data) {
            this.attach(NavigationItemPlaylist.instantiate(playlist.title, null, `#playlist:${playlist.id}`));
        }
    }

    subRenderCreateAndDownload()
    {
        this.createAndAttach('div', {class: 'input-group input-group-horizontal'}, [
            this.$refs.createPlaylist    = this.create('button', {title: 'Create playlist'}, this.create('span', {class: 'fa fa-plus-circle'})),
            this.$refs.downloadPlaylists = this.create('button', {title: 'Download playlist'}, this.create('span', {class: 'fa fa-download'}))
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
