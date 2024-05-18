import Modal from './Modal';

class ModalAddToPlaylist extends Modal 
{
    static elementName = 'modal-window-add-to-playlist';

    __construct(api, items) 
    {
        super.__construct(api);
        this.items = items;
    }

    render() 
    {
        super.render();
        this.$refs.header.innerHTML = 'Add to playlist';

        this.api.collection.playlists.list().then((response) => 
        {
            if (!response.data) {
                return;
            }

            this.$refs.body.clear();

            this.$refs.buttonGroup = this.$refs.body.createAndAttach('div', {class: 'input-group input-group-vertical'});
            for (var playlist of response.data) {
                this.$refs.buttonGroup.createAndAttach('button', { 'data-playlist': playlist.id }, playlist.title)
                  .addEventListener('click', this.onPlaylistChoosen.bind(this));
            }
        });
    }

    onPlaylistChoosen(evt) 
    {
        var playlist = evt.target.getAttribute('data-playlist');
        this.api.collection.playlistItems.addMultiple(this.items, playlist).then(() =>
        {
            alert('Item(s) added!!');
            this.remove();
        });
    }

}

ModalAddToPlaylist.register();

export default ModalAddToPlaylist;
