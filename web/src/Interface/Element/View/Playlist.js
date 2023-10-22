import ViewElement from './ViewElement';
import PlaylistItem from '../Component/PlaylistItem';
import SearchHeader from '../Component/SearchHeader';
import Pagination from '../Component/Pagination';
import Events from '../../../Helper/Events';
import QueueContextPlaylist from '../../../Queue/QueueContextPlaylist';
import Queue from '../../../Queue/Queue';

class Playlist extends ViewElement 
{
    static elementName = 'view-playlist';

    async render() 
    {
        this.classList.add('view--playlist');

        await this.fetchPlaylist().then((response) =>
        {
            return this.subRenderHeader(response);
        });

        this.fetchItems().then((response) =>
        {
            this.subRenderItems(response);
            this.subRenderNavigation(response);
        });

        Events.enableBottomReached(this);
        this.addEventListener('scroll-bottom-reached', this.bottomReached.bind(this));
        this.addEventListener('item-selected', this.onItemSelected.bind(this));
    }

    bottomReached(evt) 
    {
        console.log('Bottom of the page reached');
    }

    fetchPlaylist() 
    {
        return this.api.collection.playlists
            .get(this.request.attributes.playlistId)
            .read();
    }

    fetchItems() 
    {
        return this.api.collection.playlists
            .get(this.request.attributes.playlistId)
            .getItems(this.request.queryParams);    
    }

    subRenderHeader(response) 
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('h1', null, response.data.title);
        if (response.data.description) {
            this.$refs.headerH.createAndAttach('h3', null, response.data.description);
        }

        this.$refs.buttons = this.$refs.headerF.createAndAttach('div', { class: 'button-group' }, [
            this.$refs.buttonAdd = this.create('button', { title: 'Add new item to playlist' }, this.create('span', { class: 'fa fa-plus' })),
            this.$refs.buttonEdit = this.create('button', { title: 'Edit playlist' }, this.create('span', { class: 'fa fa-pencil' })),
            this.$refs.buttonDelete = this.create('button', { title: 'Delete entire playlist', class: 'btn-danger' }, this.create('span', { class: 'fa fa-close' }))
        ]);

        this.$refs.buttonAdd.addEventListener('click', () => 
        {
            this.fireEvent('add-item', { playlist: this.request.attributes.playlistId });
        });

        this.$refs.buttonEdit.addEventListener('click', () => 
        {
            this.fireEvent('edit-playlist', { playlistId: this.request.attributes.playlistId });
        });

        this.$refs.buttonDelete.addEventListener('click', () => 
        {
            this.fireEvent('delete-playlist', { playlist: this.request.attributes.playlistId });
        });

        this.$refs.headerB.append(SearchHeader.instantiate(this.request, '', [
            {type: 'search', name: 'title', placeholder: 'Title', class: 'main'},
            {type: 'search', name: 'artist', placeholder: 'Artist'},
            {type: 'search', name: 'genre', placeholder: 'Genre'}
        ]));
    }

    async subRenderItems(response) 
    {
        if (!response.data) {
            return;
        }

        this.$refs.playlist = this.createAndAttach('div', { class: 'playlist' });

        for (var item of response.data) {
            this.$refs.playlist.attach(PlaylistItem.instantiate(item));
        }
    }

    subRenderNavigation(response) 
    {
        this.append(Pagination.instantiate(this.api, this.request, response));
    }

    onItemSelected(evt) 
    {
        var initialBatch = [];
        for (var item of this.querySelectorAll(PlaylistItem.elementName)) {
            initialBatch.push(item.item);
        }

        for (var key in initialBatch) {
            if (initialBatch[key] == evt.detail.item) {
                initialBatch = initialBatch.slice(key);
                break;
            }
        }

        var context = new QueueContextPlaylist(
            this.api, 
            this.request.queryParams, 
            this.request.attributes.playlistId
        );

        var queue = Queue.instantiate(initialBatch, context);
        evt.detail.queue = queue;
    }
}

Playlist.register();

export default Playlist;
