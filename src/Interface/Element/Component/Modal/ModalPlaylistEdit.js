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
     * @param {Collection} collection
     * The user's collection.
     * @param {String} playlistId
     * The id of the playlist to edit.
     */
    __construct(collection, playlistId)
    {
        super.__construct(collection);
        this.playlistId = playlistId;
    }

    /**
     * @inheritdoc
     */
    subRenderModalHead()
    {
        this.$refs.header.innerHTML = 'Edit playlist';
    }

    /**
     * @inheritdoc
     */
    subRenderForm()
    {
        super.subRenderForm();

        this.collection.managePlaylist(this.playlistId).fetch()
        .then((response) =>
        {
            this.populateForm(response);
        });
    }

    /**
     * @inheritdoc
     */
    populateForm(response)
    {
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
            this.collection
                .managePlaylist(this.playlistId)
                .update(this.$refs.form.getForm())
                .then(this.onResponse.bind(this), this.onResponse.bind(this));
        });
    }

    /**
     * @inheritdoc
     */
    onResponse(response)
    {
        this.$refs.messages.messages(response.messages);

        if (response.meta.statusCode == 200) {
            alert('Edited!');
            this.fireEvent('playlist:updated');
            this.remove();
        }
    }

}

ModalPlaylistEdit.register();

export default ModalPlaylistEdit;
