import SearchHeader from '../Component/SearchHeader';
import Playlist from './Playlist';
import PlaylistItem from '../Component/PlaylistItem';
import QueueContextSearch from '../../../Queue/QueueContextSearch';
import Queue from '../../../Queue/Queue';

class Search extends Playlist 
{
    static elementName = 'view-search';

    fetch() 
    {
        return this.request.queryParams.isEmpty()
            ? new Promise((r,f)=>{return r({})})
            : this.api.collection.playlistItems.search(this.request.queryParams);
    }

    subRenderHeader(response) 
    {
        this.append(SearchHeader.instantiate(this.request, 'Search', [
            {type: 'search', name: 'title', placeholder: 'Title', class: 'main'},
            {type: 'search', name: 'artist', placeholder: 'Artist'},
            {type: 'search', name: 'genre', placeholder: 'Genre'}
        ]));
    }

    subRenderButtonGroup() 
    {
        // maybe I should invert the inheritance...
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

        var context = new QueueContextSearch(
            this.api, 
            this.request.queryParams
        );

        var queue = Queue.instantiate(initialBatch, context);
        evt.detail.queue = queue;
    }
}

Search.register();

export default Search;
