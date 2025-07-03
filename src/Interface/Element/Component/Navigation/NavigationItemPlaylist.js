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
     * @param {String} icon
     * Icon to accompany the label.
     * @param {String} href
     * URI.
     * @param {String} playlistId
     * The id of the paylist.
     * @param {Api} api
     * API to communicate with the back-end.
     */
    __construct(label, icon, href, playlistId, api)
    {
        super.__construct(label, icon, href);
        this.playlistId = playlistId;
        this.api        = api;
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

        this.api.collection.playlistItems.addMultiple(data, this.playlistId).then(() =>
        {
            alert('Item(s) added!!');
        });
    }
}

NavigationItemPlaylist.register();

export default NavigationItemPlaylist;
