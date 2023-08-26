import ViewElement from './ViewElement';
import Messages from '../Component/Messages';
import FormElent from '../Component/Form/FormElent';

class ItemEdit extends ViewElement 
{
    static elementName = 'view-edit-item';

    async render() 
    {
        this.fetch().then((response) =>
        {
            this.renderHeader(response);
            this.renderForm(response);
        });
    }

    fetch() 
    {
        return this.api.collection.playlistItems.get(this.request.attributes.itemUuid).read();
    }

    renderHeader(response) 
    {
        this.createAndAttach('h1', null, 'Editing item');
        this.$refs.messages = this.attach(Messages.instantiate());
    }

    renderForm(response) 
    {
        var title      = response.data.title || '';
        var artists    = this.getArray(response.data, 'artist');
        var featuring  = this.getArray(response.data, 'featuring');
        var cover      = response.data.cover || '';
        var album      = response.data.album || '';
        var soundtrack = this.getArray(response.data, 'soundtrack');
        var genres     = this.getArray(response.data, 'genre');

        this.$refs.form = this.attach(FormElent.instantiate());
        this.$refs.form.addTextField('title', 'Title', title);
        this.$refs.form.addTextField('album', 'Album', album);
        this.$refs.form.addMultiTextField('artist[]', 'Artist', artists, 'Artist', 'Add artist');
        this.$refs.form.addMultiTextField('featuring[]', 'Artist', featuring, 'Featuring', 'Add featured artist');
        this.$refs.form.addTextField('cover', 'Cover', cover);
        this.$refs.form.addMultiTextField('soundtrack[]', 'Soundtrack', soundtrack, 'Soundtrack', 'Add soundtrack');
        this.$refs.form.addMultiTextField('genre[]', 'Genre', genres, 'Genre', 'Add genre');
        this.$refs.form.addSubmitButton('save', 'Save');

        //------------------------

        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlistItems
                .get(this.request.attributes.itemUuid)
                .update(this.$refs.form.getForm())
                .then(this.formSubmitted.bind(this), this.formSubmitted.bind(this));
        });
    }

    getArray(object, property) 
    {
        if (! object[property]) {
            return [''];
        }

        return Array.isArray(object[property])
            ? object[property]
            : [object[property]];
    }

    formSubmitted(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes.length) {
            this.dispatchEvent(new CustomEvent('item-updated', {bubbles: true}));
        }
    }

}

ItemEdit.register();

export default ItemEdit;
