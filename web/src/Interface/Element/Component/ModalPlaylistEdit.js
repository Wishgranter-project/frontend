import ModalPlaylistAdd from './ModalPlaylistAdd';

class ModalPlaylistEdit extends ModalPlaylistAdd 
{
    static elementName = 'modal-edit-playlist';

    __construct(api, playlistId) 
    {
        this.api = api;
        this.playlistId = playlistId;
    }

    subRenderHeader() 
    {
        super.subRenderHeader();
        this.$refs.header.innerHTML = 'Edit playlist';
    }

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

    subRenderForm(response) 
    {
        super.subRenderForm();

        this.$refs.form
        .setValue('title', response.data.title || '')
        .setValue('description', response.data.description || '');
    }

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

    onResponse(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes && response.successes.length) {
            alert('Edited!');
            this.fireEvent('item-updated');
            this.remove();
        }
    }

}

ModalPlaylistEdit.register();

export default ModalPlaylistEdit;
