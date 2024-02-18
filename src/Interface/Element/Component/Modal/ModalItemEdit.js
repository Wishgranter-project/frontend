import ModalItemAdd from './ModalItemAdd';

class ModalItemEdit extends ModalItemAdd 
{
    static elementName = 'modal-edit-item';

    __construct(api, uuid) 
    {
        this.api = api;
        this.uuid = uuid;
    }

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

    subRenderHeader() 
    {
        super.subRenderHeader();
        this.$refs.header.innerHTML = 'Edit item';
    }

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
