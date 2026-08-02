import ModalForm from './ModalForm';
import FormElent from '../Form/FormElent';

/**
 * Form to add a new item to the collection.
 *
 * @class
 */
class ModalItemAdd extends ModalForm
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-add-item';

    /**
     * Constructor.
     *
     * @param {Api} api
     * Api to communicate with the backend.
     * @param {String} playlistId
     * The id of the playlist to add the item to.
     */
    __construct(api, playlistId)
    {
        super.__construct();
        this.api = api;
        this.playlistId = playlistId;
    }

    /**
     * @inheritdoc
     */
    subRenderHead()
    {
        this.$refs.header.innerHTML = 'Add item';
    }

    /**
     * @inheritdoc
     */
    subRenderForm()
    {
        this.$refs.form = this.$refs.body.attach(FormElent.instantiate());
        this.$refs.form.addTextField('title', 'Title', '');
        this.$refs.form.addTextField('album', 'Album', '');
        this.$refs.form.addMultiTextField('artist[]', 'Artist', [''], 'Artist', 'Add artist');
        this.$refs.form.addMultiTextField('featuring[]', 'Artist', [''], 'Featuring', 'Add featured artist');
        this.$refs.form.addTextField('cover', 'Cover', '');
        this.$refs.form.addMultiTextField('soundtrack[]', 'Soundtrack', [''], 'Soundtrack', 'Add soundtrack');
        this.$refs.form.addMultiTextField('genre[]', 'Genre', [''], 'Genre', 'Add genre');
        if (this.playlistId) {
            this.$refs.form.addHidden('playlist', this.playlistId || '');
        }

        this.$refs.form.addSubmitAndCancel();

        this.$refs.form.addEventListener('form:cancel', () => 
        {
            this.remove();
        });
    }

    /**
     * @inheritdoc
     */
    subRenderFooter()
    {
    }

    /**
     * @inheritdoc
     */
    subRenderSubmitListener()
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.manageUser().collection
                .manageItem(null)
                .create(this.$refs.form.getForm())
                .then(this.onResponse.bind(this), this.onResponse.bind(this));
        });
    }

    /**
     * @inheritdoc
     */
    onResponse(response)
    {
        this.$refs.messages.messages(response.messages);

        if (response.meta.statusCode == 201) {
            alert('Added!');
            this.fireEvent('item:newly-created', { items: [response.data], playlist: this.playlistId });
            this.remove();
        }
    }
}

ModalItemAdd.register();

export default ModalItemAdd;
