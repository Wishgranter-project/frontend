import SearchHeader from '../Component/SearchHeader';
import Playlist from './Playlist';

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
}

Search.register();

export default Search;
