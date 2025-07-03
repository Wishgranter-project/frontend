import ModalPlaylistAdd from './ModalPlaylistAdd';

/**
 * Form to edit existing playlist.
 *
 * @class
 */
class ModalPlaylistEdit extends ModalPlaylistAdd 
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-edit-playlist';

    /**
     * Constructor.
     *
     * @param {Api} api
     * API to communicate with the back-end.
     * @param {String} playlistId
     * The id of the playlist to edit.
     */
    __construct(api, playlistId) 
    {
        super.__construct(api);
        this.playlistId = playlistId;
    }

    /**
     * @inheritdoc
     */
    subRenderHeader() 
    {
        super.subRenderHeader();
        this.$refs.header.innerHTML = 'Edit playlist';
    }

    /**
     * @inheritdoc
     */
    render() 
    {
        super.subRenderModal();

        this.api.collection.playlists.get(this.playlistId).read()
        .then((response) =>
        {
            this.subRenderHeader();
            this.subRenderForm(response);
            this.subRenderSubmitListener();
        });
    }

    /**
     * @inheritdoc
     */
    subRenderForm(response) 
    {
        super.subRenderForm();

        this.$refs.form
        .setValue('title', response.data.title || '')
        .setValue('description', response.data.description || '');
    }

    /**
     * @inheritdoc
     */
    subRenderSubmitListener() 
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlists
                .get(this.playlistId)
                .update(this.$refs.form.getForm())
                .then(this.onResponse.bind(this), this.onResponse.bind(this));
        });
    }

    /**
     * @inheritdoc
     */
    onResponse(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes && response.successes.length) {
            alert('Edited!');
            this.fireEvent('playlist:updated');
            this.remove();
        }
    }

}

ModalPlaylistEdit.register();

export default ModalPlaylistEdit;
