import Modal from './Modal';

class ModalAddToPlaylist extends Modal 
{
    static elementName = 'modal-window-add-to-playlist';

    __construct(api, item) 
    {
        super.__construct(api);
        this.item = item;
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

            for (var playlist of response.data) {
                this.$refs.body.createAndAttach('div', { 'data-playlist': playlist.id }, playlist.title)
                  .addEventListener('click', this.onPlaylistChoosen.bind(this));
            }
        });
    }

    onPlaylistChoosen(evt) 
    {
        var playlist = evt.target.getAttribute('data-playlist');

        var promise = this.item.uuid
            ? this.api.collection.playlistItems.create({ playlist, uuid: this.item.uuid })
            : this.api.collection.playlistItems.create({ playlist, title: this.item.title, artist: this.item.artist });

        promise.then( () =>
        {
            alert('Item added!!');
            this.remove();
        });
    }

}

ModalAddToPlaylist.register();

export default ModalAddToPlaylist;
