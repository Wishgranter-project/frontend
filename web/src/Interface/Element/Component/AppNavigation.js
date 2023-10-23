import CustomElement from '../CustomElement';

class AppNavigation extends CustomElement 
{
    static elementName = 'app-navigation';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.clear();
        this.classList.add('app-navigation');

        this.addGenericNavItem('#home', 'Home', 'fa-home');
        this.addGenericNavItem('#search', 'Search', 'fa-search');
        this.addGenericNavItem('#discover:artist', 'Discover', 'fa fa-search-plus');

        this.createAndAttach('hr');

        this.$refs.playlists = this.createAndAttach('div', {class: 'app-navigation__playlists'});

        this.createAndAttach('hr');

        this.$refs.artists = this.createAndAttach('div', {class: 'app-navigation__artists'});

        this.updatePlaylists();
        this.updateArtists();
    }

    updatePlaylists() 
    {
        this.api.collection.playlists.list().then((response) => 
        {
            if (response.data) {
                for (var playlist of response.data) {
                    this.addPlaylistNavItem(playlist.id, playlist.title);
                }
            }

            this.$refs.playlists.createAndAttach('div', {class: 'input-group input-group-horizontal'}, [
                this.$refs.createPlaylist    = this.create('button', {title: 'Create playlist'}, this.create('span', {class: 'fa fa-plus-circle'})),
                this.$refs.downloadPlaylists = this.create('button', {title: 'Download playlist'}, this.create('span', {class: 'fa fa-download'}))
            ]);

            this.$refs.createPlaylist.addEventListener('click', () =>
            {
                this.fireEvent('add-playlist');
            });

            this.$refs.downloadPlaylists.addEventListener('click', () =>
            {
                this.fireEvent('download-playlists');
            });

        });
    }

    updateArtists() 
    {
        this.api.collection.artists.list().then((response) => 
        {
            for (var artist in response.data) {
                this.addArtistNavItem(artist, response.data[artist]);
            }
        });
    }

    addArtistNavItem(artistName, count) 
    {
        this.$refs.artists.createAndAttach('div', {class: 'app-navigation__item'},
            this.create('a', {href: '#search?artist=' + artistName}, [
                this.create('span', {class: 'label'}, artistName),
                this.create('span', {class: 'badge'}, count)
            ])
        );
    }

    addPlaylistNavItem(playlistId, playlistTitle) 
    {
        this.$refs.playlists.createAndAttach('div', {class: 'app-navigation__item'}, [
            this.create('a', {href: `#playlist:${playlistId}`, class: 'ellipsis'}, playlistTitle)
        ]);
    }

    addGenericNavItem(href, label, icon = null) 
    {
        var item = this.createGenericNavItem(href, label, icon);
        this.append(item);
        return item;
    }

    createGenericNavItem(href, label, icon = null) 
    {
        var item, a;

        item = this.createAndAttach('div', {class: 'app-navigation__item'});

        a = href != null 
            ? item.createAndAttach('a', { href }) 
            : item.createAndAttach('a');

        if (icon) {
            a.createAndAttach('span', {class: 'fa ' + icon})
        }

        a.append(label);

        return item;
    }
}

AppNavigation.register();

export default AppNavigation;
