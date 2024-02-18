import SearchHeader       from '../Component/SearchHeader';
import ViewPlaylist       from './ViewPlaylist';
import PlaylistItem       from '../Component/PlaylistItem';
import QueueContextSearch from '../../../Line/QueueContextSearch';
import Queue              from '../../../Line/Queue';

class ViewSearch extends ViewPlaylist 
{
    static elementName = 'view-search';

    async render() 
    {
        this.classList.add('view--search');

        this.fetch().then((response) =>
        {
            this.subRenderHeader(response);
            this.subRenderItems(response);
            this.subRenderNavigation(response);
        });

        this.addEventListener('queue:item-selected', this.onItemSelected.bind(this));
    }

    fetch() 
    {
        return this.hashRequest.queryParams.isEmpty()
            ? new Promise((r,f)=>{return r({})})
            : this.api.collection.playlistItems.search(this.hashRequest.queryParams);
    }

    subRenderHeader(response) 
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('h1', null, 'Search');

        this.$refs.headerB.append(SearchHeader.instantiate(this.hashRequest, '', [
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
            this.hashRequest.queryParams
        );

        var queue = Queue.instantiate(initialBatch, context);
        evt.detail.queue = queue;
    }
}

ViewSearch.register();

export default ViewSearch;
