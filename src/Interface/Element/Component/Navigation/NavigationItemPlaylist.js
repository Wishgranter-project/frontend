import NavigationItem from './NavigationItem';

/**
 * Playlist navigation item.
 *
 * @class
 */
class NavigationItemPlaylist extends NavigationItem
{
    /**
     * @inheritdoc
     */
    static elementName = 'navigation-item-playlist';

    /**
     * Constructor.
     *
     * @param {String} label
     * Human-readable string.
     * @param {String} href
     * URI.
     * @param {String} playlistId
     * The id of the paylist.
     * @param {Api} api
     * Api to communicate with the backend.
     */
    __construct(label, href, playlistId, api)
    {
        super.__construct(label, href, label);
        this.playlistId = playlistId;
        this.api = api;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        super.render();
        this.addEventListener('drop', this.onDrop.bind(this));
        this.addEventListener('dragover', this.onDragOver.bind(this));
    }

    /**
     * Listener for the dragover event.
     *
     * @protected
     * @listens dragend
     *
     * @param {Event} evt
     * Drag over event.
     */
    onDragOver(evt)
    {
        evt.preventDefault();
    }

    /**
     * Listener for the drop event.
     *
     * Adds dragged items to the playlist.
     *
     * @todo
     * WTF was I thinking ? Fucking remove this at first chance.
     *
     * @protected
     * @listens drop
     *
     * @param {Event} evt
     * Drop event.
     */
    onDrop(evt)
    {
        var json = evt.dataTransfer.getData('text');
        var data = JSON.parse(json);

        this.api.manageUser().collection.addMultiplePlaylistItems(data, this.playlistId).then((res) =>
        {
            alert('Item(s) added!!');
            
            var items = [];
            for (var r of res) {
                items.push(r.data);
            }
            
            this.fireEvent('item:newly-created', { items, playlist: this.playlistId });
        });
    }
}

NavigationItemPlaylist.register();

export default NavigationItemPlaylist;
