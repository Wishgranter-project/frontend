import ViewElement from './ViewElement';
import Messages from '../Component/Messages';

class PlaylistAdd extends ViewElement 
{
    static elementName = 'view-add-playlist';

    async render() 
    {
        this.renderHeader();
        this.renderForm();
    }

    renderHeader() 
    {
        this.createAndAttach('h1', null, 'Adding new playlist');
        this.$refs.messages = this.attach(Messages.instantiate());
    }

    renderForm() 
    {
        var form = this.createAndAttach('form', {class: 'horizontal', method: 'post', enctype: 'multipart/form-data'}, [
            this.create('label', {class: 'form-group'}, [
                this.create('span', {class: 'label col-sm-2'}, 'Title'),
                this.create('input', {type: 'text', class: 'col-sm-10', name: 'title'})
            ]),

            this.create('label', {class: 'form-group'}, [
                this.create('span', {class: 'label col-sm-2'}, 'Description'),
                this.create('textarea', {type: 'text', class: 'col-sm-10', name: 'description'})
            ]),

            this.create('div', {class: 'form-group'}, [
                this.create('input', {type: 'submit', value: 'Save', class: 'col-12 btn-main'})
            ])
        ]);

        form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.collection.playlists
                .create(form)
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

PlaylistAdd.register();

export default PlaylistAdd;
