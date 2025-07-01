import CustomElement from '../CustomElement';
import ListOfItems   from './ListOfItems';

/**
 * Displays the contents of a single album.
 */
class Album extends CustomElement 
{
    static elementName = 'album-container';

    __construct(artist, title, api) 
    {
        this.artist = artist;
        this.title = title;
        this.api = api;
    }

    async render()
    {
        this.classList.add(this.elementName);

        this.api.discover.albums.get(this.artist, this.title).read().then((response) =>
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

        this.$refs.headerB.createAndAttach('h2', null, response.data.title);

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

    /**
     * Return the playable items displayed in this view.
     *
     * @param {Object} beginningWith
     * Beginning with this one.
     *
     * @returns {Array}
     * Of playable items.
     */
    getPlayableItems(beginningWith = null)
    {
        var initialBatch = this.$refs.playlist.getItems();

        for (var key in initialBatch) {
            if (initialBatch[key] == beginningWith) {
                initialBatch = initialBatch.slice(key);
                break;
            }
        }

        return initialBatch;
    }
}

Album.register();

export default Album;
