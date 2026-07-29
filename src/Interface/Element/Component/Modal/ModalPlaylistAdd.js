import ModalItemAdd from './ModalItemAdd';
import FormElent from '../Form/FormElent';

/**
 * Form to create a new playlist.
 *
 * @class
 */
class ModalPlaylistAdd extends ModalItemAdd
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-add-playlist';

    /**
     * @inheritdoc
     */
    subRenderHead()
    {
        this.$refs.header.innerHTML = 'Add playlist';
    }

    /**
     * @inheritdoc
     */
    subRenderForm()
    {
        this.$refs.form = this.$refs.body.attach(FormElent.instantiate());
        this.$refs.form.addTextField('title', 'Title', '');
        this.$refs.form.addTextArea('description', 'Descrição', '');
        
        this.$refs.form.addSubmitAndCancel();

        this.$refs.form.addEventListener('form:cancel', () => 
        {
            this.remove();
        });
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
                .managePlaylist(null)
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
            this.fireEvent('playlist:newly-created');
            this.remove();
        }
    }
}

ModalPlaylistAdd.register();

export default ModalPlaylistAdd;
