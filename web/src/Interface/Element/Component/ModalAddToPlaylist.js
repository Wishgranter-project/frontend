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
        var promise;
        var promises = [];

        for (var item of this.items) {
            promise = item.uuid
                ? this.api.collection.playlistItems.create({ playlist, uuid: item.uuid })
                : this.api.collection.playlistItems.create({ playlist, title: item.title, artist: item.artist });
            promises.push(promise);
        }

        Promise.all(promises).then( () =>
        {
            alert('Item added!!');
            this.remove();
        });
    }

}

ModalAddToPlaylist.register();

export default ModalAddToPlaylist;
