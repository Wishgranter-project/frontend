import ModalForm from './ModalForm';

import FormElent from '../Form/FormElent';

class ModalItemAdd extends ModalForm 
{
    static elementName = 'modal-add-item';

    __construct(api, playlistId) 
    {
        this.api = api;
        this.playlistId = playlistId;
    }


    subRenderHeader() 
    {
        super.subRenderHeader();
        this.$refs.header.innerHTML = 'Add item';
    }

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
        this.$refs.form.addSubmitButton('save', 'Save');
    }

    subRenderSubmitListener() 
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlistItems
                .create(this.$refs.form.getForm())
                .then(this.onResponse.bind(this), this.onResponse.bind(this));
        });
    }

    onResponse(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes && response.successes.length) {
            alert('Added!');
            this.fireEvent('item-added');
            this.remove();
        }
    }
}

ModalItemAdd.register();

export default ModalItemAdd;
