import CustomElement from '../CustomElement';

class NavMenu extends CustomElement 
{
    static elementName = 'nav-menu';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.clear();
        this.classList.add('app-nav');

        this.addGenericNavItem('#home', 'Home', 'fa-chevron-right');
        this.addGenericNavItem('#search', 'Search', 'fa-chevron-right');
        this.addGenericNavItem('#discover:artist', 'Discover', 'fa-chevron-right');

        this.createAndAttach('hr');

        this.$refs.playlists = this.createAndAttach('div', {class: 'app-nav__playlists'});

        this.createAndAttach('hr');

        this.$refs.artists = this.createAndAttach('div', {class: 'app-nav__artists'});

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

            this.$refs.playlists.append(this.$refs.createPlaylist = this.createGenericNavItem(null, 'Create playlist', 'fa-plus-circle'));
            this.$refs.createPlaylist.addEventListener('click', () =>
            {
                this.fireEvent('add-playlist');
            });

            this.$refs.playlists.append(this.$refs.downloadPlaylists = this.createGenericNavItem(null, 'Download playlists', 'fa-download'));
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
            for (var artist of response.data) {
                this.addArtistNavItem(artist);
            }
        });
    }

    addArtistNavItem(artistName) 
    {
        this.$refs.artists.createAndAttach('div', {class: 'app-nav__item'},
            this.create('a', {href: '#search?artist=' + artistName}, artistName)
        );
    }

    addPlaylistNavItem(playlistId, playlistTitle) 
    {
        var edit;
        this.$refs.playlists.createAndAttach('div', {class: 'app-nav__item'}, [
            this.create('a', {href: `#playlist:${playlistId}`, class: 'ellipsis'}, playlistTitle),
            edit = this.create('a', { class: 'editing'}, this.create('span', {class: 'fa fa-pencil'}))
        ]);

        edit.addEventListener('click', () => 
        {
            this.fireEvent('edit-playlist', { playlistId });
        });
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

        item = this.createAndAttach('div', {class: 'app-nav__item'});

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

NavMenu.register();

export default NavMenu;
