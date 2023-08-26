import ViewElement from './ViewElement';
import Messages from '../Component/Messages';

class PlaylistEdit extends ViewElement 
{
    static elementName = 'view-edit-playlist';

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
        return this.api.collection.playlists.get(this.request.attributes.playlistId).read();
    }

    renderHeader(response) 
    {
        this.createAndAttach('h1', null, 'Editing playlist');
        this.$refs.messages = this.attach(Messages.instantiate());
    }

    renderForm(response) 
    {
        var form = this.createAndAttach('form', {class: 'horizontal', method: 'post', enctype: 'multipart/form-data'}, [

            this.create('label', {class: 'form-group'}, [
                this.create('span', {class: 'label col-sm-2'}, 'Title'),
                this.create('input', {type: 'text', class: 'col-sm-10', name: 'title', value: response.data.title})
            ]),

            this.create('label', {class: 'form-group'}, [
                this.create('span', {class: 'label col-sm-2'}, 'Description'),
                this.create('textarea', {type: 'text', class: 'col-sm-10', name: 'description'}, response.data.description || '')
            ]),

            this.create('div', {class: 'form-group'}, [
                this.create('input', {type: 'submit', value: 'Save', class: 'col-12 btn-main'})
            ])
        ]);

        form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlists.get(this.request.attributes.playlistId)
                .update(form)
                .then(this.formSubmitted.bind(this), this.formSubmitted.bind(this));
        });
    }

    formSubmitted(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes.length) {
            this.dispatchEvent(new CustomEvent('playlist-updated', {bubbles: true}));
        }
    }

}

PlaylistEdit.register();

export default PlaylistEdit;
