import CustomElement from '../CustomElement';
import ListOfItems   from './ListOfItems';

/**
 * Element to list the contents of a single album.
 *
 * @class
 */
class Album extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'album-container';

    /**
     * Constructor.
     *
     * @param {String} artist
     * The name of the artist.
     * @param {String} title
     * The title of the album.
     * @param {Api} api
     * Object to communicate with the back-end.
     */
    __construct(artist, title, api)
    {
        super.__construct();
        this.artist = artist;
        this.title = title;
        this.api = api;
    }

    /**
     * @inheritdoc
     */
    async render()
    {
        this.classList.add(Album.elementName);

        this.api.discover.albums.get(this.artist, this.title).read().then((response) =>
        {
            this.subRenderHeader(response);
            this.subRenderTracks(response);
        });

        this.addEventListener('queue:item-selected', this.onItemSelected.bind(this));
    }

    subRenderHeader(response)
    {
        this.$refs.header = this.createAndAttach('header', null, this.create('h2', null, response.data.title));

        this.$refs.buttons = this.$refs.header.createAndAttach('div', { class: 'input-group input-group-horizontal' }, [ 
            this.$refs.playButton = this.create('button', { title: 'Play album' }, this.create('span', { class: 'fa fa-play' })),
            this.$refs.addButton = this.create('button', { title: 'Add all tracks to your collection' }, this.create('span', { class: 'fa fa-plus' }))
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
     * Return the list of playable items displayed by the element.
     *
     * @param {Object} beginningWith
     * Beginning with this one.
     *
     * @returns {Array}
     * List of playable items.
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
