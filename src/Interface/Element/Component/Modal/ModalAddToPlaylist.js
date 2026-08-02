import Modal from './Modal';

/**
 * Prompt the user to chose a playlist to add items to.
 *
 * @class
 */
class ModalAddToPlaylist extends Modal
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-window-add-to-playlist';

    /**
     * Constructor.
     *
     * @param {Api} api
     * Api to communicate with the backend.
     * @param {Array} items
     * List of items to add to the collection.
     */
    __construct(api, items)
    {
        super.__construct();
        this.api = api;
        this.items = items;
    }

    /**
     * @inheritdoc
     */
    subRenderHead()
    {
        this.$refs.header.innerHTML = 'Add to playlist';
    }

    subRenderBody()
    {
        this.api.manageUser().collection.fetchPlaylists().then((response) => 
        {
            if (!response.data) {
                return;
            }

            this.$refs.body.clear();

            this.$refs.buttonGroup = this.$refs.body.createAndAttach('div', {class: 'input-group input-group-vertical'});
            for (var playlist of response.data) {
                this.$refs.buttonGroup.createAndAttach('button', { 'data-playlist': playlist.id }, playlist.title)
                  .addEventListener('click', this.onPlaylistChoosen.bind(this));
            }
        });
    }

    /**
     * Listens for click events.
     *
     * @listens click
     * @protected
     *
     * @param {Event} evt
     * Click event.
     */
    onPlaylistChoosen(evt)
    {
        var playlistId = evt.target.getAttribute('data-playlist');
        this.api.manageUser().collection.addMultiplePlaylistItems(this.items, playlistId).then(() =>
        {
            alert('Item(s) added!!');
            this.remove();
        });
    }

}

ModalAddToPlaylist.register();

export default ModalAddToPlaylist;
