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
        this.fetch().then((response) =>
        {
            this.subRenderHeader(response);
            this.subRenderItems(response);
            this.subRenderNavigation(response);
            this.subRenderButtonGroup();
        });

        Events.enableBottomReached(this);
        this.addEventListener('scroll-bottom-reached', this.bottomReached.bind(this));
        this.addEventListener('item-selected', this.onItemSelected.bind(this));
    }

    bottomReached(evt) 
    {
        console.log('Bottom of the page reached');
    }

    fetch() 
    {
        return this.api.collection.playlists
            .get(this.request.attributes.playlistId)
            .getItems(this.request.queryParams);    
    }

    subRenderHeader(response) 
    {
        return this.append(SearchHeader.instantiate(this.request, response.playlist ? response.playlist.title : this.request.attributes.playlistId, [
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

    subRenderButtonGroup() 
    {
        this.createAndAttach('div', {class: 'input-group input-group-horizontal'}, [
            this.$refs.buttonCreate = this.create('button', {class: 'main'}, 'New Item'),
            this.$refs.buttonDelete = this.create('button', {class: 'btn-danger'}, 'Delete playlist')
        ]);

        this.$refs.buttonCreate.addEventListener('click', () => 
        {
            this.fireEvent('add-item', { playlist: this.request.attributes.playlistId });
        });

        this.$refs.buttonDelete.addEventListener('click', () => 
        {
            this.fireEvent('delete-playlist', { playlist: this.request.attributes.playlistId });
        });
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
