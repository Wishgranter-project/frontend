import SearchHeader from '../Component/SearchHeader';
import Playlist from './Playlist';
import QueueContextSearch from '../QueueContextSearch';
import PlaylistItem from '../Component/PlaylistItem';

class Search extends Playlist 
{
    static elementName = 'view-search';

    fetch() 
    {
        return this.request.queryParams.isEmpty()
            ? new Promise((r,f)=>{return r({})})
            : this.api.collection.playlistItems.search(this.request.queryParams);
    }

    renderHeader(response) 
    {
        this.append(SearchHeader.instantiate(this.request, 'Search', [
            {type: 'search', name: 'title', placeholder: 'Title', class: 'main'},
            {type: 'search', name: 'artist', placeholder: 'Artist'},
            {type: 'search', name: 'genre', placeholder: 'Genre'}
        ]));
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

        evt.detail.context = new QueueContextSearch(
            initialBatch,
            this.api, 
            this.request.queryParams
        );
    }
}

Search.register();

export default Search;
