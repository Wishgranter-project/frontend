import MusicPlayingView from './MusicPlayingView';
import PlaylistItem     from '../Component/PlaylistItem';

class ViewAlbum extends MusicPlayingView 
{
    static elementName = 'view-release';

    async render()
    {
        this.classList.add('view--release');

        var artist = this.hashRequest.queryParams.get('artist');
        var title  = this.hashRequest.queryParams.get('title');

        this.api.discover.albums.get(artist, title).read().then((response) =>
        {
            this.subRenderHeader(response);
            this.subRenderTracks(response);
        });

        this.addEventListener('queue:item-selected', this.onItemSelected.bind(this));
    }

    subRenderHeader(response)
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('img', {src: response.data.thumbnail || 'dist/img/missing-cover-art.webp' });

        this.$refs.headerB.createAndAttach('h1', null, response.data.title);
        this.$refs.headerB.createAndAttach('h3', null, this.create('a', { title: response.data.artist, href: '#discover:albums?artist=' + response.data.artist }, response.data.artist));

        this.$refs.buttons = this.$refs.headerF.createAndAttach('div', { class: 'button-group' }, [ 
            this.$refs.playButton = this.create('button', { title: 'Play album' }, this.create('span', { class: 'fa fa-play' })),
            this.$refs.addButton = this.create('button', { title: 'Add all tracks to playlist' }, this.create('span', { class: 'fa fa-plus' }))
        ]);

        this.$refs.playButton.addEventListener('click', this.playEntireAlbum.bind(this));
        this.$refs.addButton.addEventListener('click', this.addEntireAlbumToPlaylist.bind(this));
    }

    subRenderTracks(response)
    {
        if (!response.data.tracks) {
            return;
        }

        this.$refs.playlist = this.createAndAttach('div', { class: 'playlist' });

        for (var t of response.data.tracks) {
            this.$refs.playlist.append(PlaylistItem.instantiate({ title: t, artist: response.data.artist, album: response.data.title }))
        }
    }

    addEntireAlbumToPlaylist()
    {
        var items = this.getPlayableItems();
        this.fireEvent('item:intention:add-to-collection', { items });
    }

    playEntireAlbum(evt)
    {
        var items = this.getPlayableItems();
        this.fireEvent('queue:item-selected', {
            item: items
        });
    }

    // Play the item selected and subsequent ones, leave the ones before it.
    onItemSelected(evt)
    {
        var items = this.getPlayableItems(evt.detail.item);
        evt.detail.item = items;
    }
}

ViewAlbum.register();

export default ViewAlbum;
