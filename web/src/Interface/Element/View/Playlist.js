import ViewElement from './ViewElement';
import PlaylistItem from '../Component/PlaylistItem';
import SearchHeader from '../Component/SearchHeader';
import Pagination from '../Component/Pagination';
import Events from '../../../Helper/Events';
import QueueContextPlaylist from '../QueueContextPlaylist';

class Playlist extends ViewElement 
{
    static elementName = 'view-playlist';

    async render() 
    {
        this.fetch().then((response) =>
        {
            this.renderHeader(response);
            this.renderItems(response);
            this.renderNavigation(response);
            this.renderNewItem();
        });

        Events.enableBottomReached(this);
        this.addEventListener('scroll-bottom-reached', this.bottomReached.bind(this));

        this.addEventListener('item-selected', this.onItemSelected.bind(this));
    }

    bottomReached(evt) 
    {
        console.log('end of the line');
    }

    fetch() 
    {
        if (this.request.queryParams.without('page').isEmpty()) {
            return this.api.collection.playlists
                .get(this.request.attributes.playlistId)
                .getItems(this.request.queryParams);
        } else {
            return this.api.collection.playlistItems
                .search(this.request.queryParams.withAdded('playlist', this.request.attributes.playlistId));
        }
    }

    renderHeader(response) 
    {
        return this.append(SearchHeader.instantiate(this.request, response.playlist ? response.playlist.title : this.request.attributes.playlistId, [
            {type: 'search', name: 'title', placeholder: 'Title', class: 'main'},
            {type: 'search', name: 'artist', placeholder: 'Artist'},
            {type: 'search', name: 'genre', placeholder: 'Genre'}
        ]));
    }

    async renderItems(response) 
    {
        if (response.data) {
            for (var item of response.data) {
                this.attach(PlaylistItem.instantiate(item));
            }
        }
    }

    renderNavigation(response) 
    {
        this.append(Pagination.instantiate(this.api, this.request, response));
    }

    renderNewItem() 
    {
        this.createAndAttach('a', {href: '#playlist:' + this.request.attributes.playlistId + '/create-item' }, 'New Item')
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

        evt.detail.context = new QueueContextPlaylist(
            initialBatch,
            this.api, 
            this.request.attributes.playlistId, 
            this.request.queryParams
        );
    }
}

Playlist.register();

export default Playlist;
