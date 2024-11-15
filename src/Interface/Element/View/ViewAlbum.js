import MusicPlayingView from './MusicPlayingView';
import ListOfItems       from '../Component/ListOfItems';
import PlaylistItem     from '../Component/PlaylistItem';

/**
 * Displays the contents of a single album.
 */
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
        this.$refs.addButton.addEventListener('click', this.addEntireAlbumToCollection.bind(this));
    }

    subRenderTracks(response)
    {
        if (!response.data.tracks) {
            return;
        }

        var tracks = [];
        for (var t of response.data.tracks) {
            tracks.push({ title: t, artist: response.data.artist, album: response.data.title });
        }

        this.$refs.playlist = ListOfItems.instantiate(tracks);
        this.$refs.playlist.classList.add('playlist');
        this.append(this.$refs.playlist);
    }

    addEntireAlbumToCollection()
    {
        var items = this.getPlayableItems();
        this.fireEvent('item:intention:add-to-collection', { items });
    }

    playEntireAlbum()
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
