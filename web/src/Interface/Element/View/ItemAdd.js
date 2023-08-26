import ViewElement from './ViewElement';
import Messages from '../Component/Messages';
import FormElent from '../Component/Form/FormElent';

class ItemAdd extends ViewElement 
{
    static elementName = 'view-add-item';

    render() 
    {
        this.renderHeader();
        this.renderForm();
    }

    renderHeader() 
    {
        this.createAndAttach('h1', null, 'Adding item');
        this.$refs.messages = this.attach(Messages.instantiate());
    }

    renderForm() 
    {
        this.$refs.form = this.attach(FormElent.instantiate());
        this.$refs.form.addTextField('title', 'Title', '');
        this.$refs.form.addTextField('album', 'Album', '');
        this.$refs.form.addMultiTextField('artist[]', 'Artist', [''], 'Artist', 'Add artist');
        this.$refs.form.addMultiTextField('featuring[]', 'Artist', [''], 'Featuring', 'Add featured artist');
        this.$refs.form.addTextField('cover', 'Cover', '');
        this.$refs.form.addMultiTextField('soundtrack[]', 'Soundtrack', [''], 'Soundtrack', 'Add soundtrack');
        this.$refs.form.addMultiTextField('genre[]', 'Genre', [''], 'Genre', 'Add genre');
        this.$refs.form.addHidden('playlist', this.request.attributes.playlistId);
        this.$refs.form.addSubmitButton('save', 'Save');

        //------------------------

        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlistItems
                .create(this.$refs.form.getForm())
                .then(this.formSubmitted.bind(this), this.formSubmitted.bind(this));
        });
    }

    formSubmitted(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes.length) {
            this.dispatchEvent(new CustomEvent('item-updated', {bubbles: true}));
        }
    }

}

ItemAdd.register();

export default ItemAdd;
