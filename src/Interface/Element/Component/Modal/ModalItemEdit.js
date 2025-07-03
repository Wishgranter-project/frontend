import ModalItemAdd from './ModalItemAdd';

/**
 * Form to edit existing item in the collection.
 *
 * @class
 */
class ModalItemEdit extends ModalItemAdd
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-edit-item';

    /**
     * Constructor.
     *
     * @param {Api} api
     * API to communicate with the back-end.
     * @param {String} uuid
     * The uuid of the playlist item to edit.
     */
    __construct(api, uuid)
    {
        super.__construct(api);
        this.uuid = uuid;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        super.subRenderModal();

        this.api.collection.playlistItems.get(this.uuid).read()
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
    subRenderHeader()
    {
        super.subRenderHeader();
        this.$refs.header.innerHTML = 'Edit item';
    }

    /**
     * @inheritdoc
     */
    subRenderForm(response)
    {
        super.subRenderForm();

        this.$refs.form
        .setValue('title', response.data.title || '')
        .setValue('artist[]', response.data.artist || [''])
        .setValue('featuring[]', response.data.featuring || [''])
        .setValue('cover', response.data.cover || '')
        .setValue('album', response.data.album || '')
        .setValue('soundtrack[]', response.data.soundtrack || [''])
        .setValue('genre[]', response.data.genre || ['']);
    }

    /**
     * @inheritdoc
     */
    subRenderSubmitListener()
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlistItems
                .get(this.uuid)
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
            this.fireEvent('item:updated');
            this.remove();
        }
    }

}

ModalItemEdit.register();

export default ModalItemEdit;
