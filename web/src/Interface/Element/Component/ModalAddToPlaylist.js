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
        var playlistId = evt.target.getAttribute('data-playlist');
        console.log(playlistId);
    }

}

ModalAddToPlaylist.register();

export default ModalAddToPlaylist;
