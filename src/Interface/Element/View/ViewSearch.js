import SearchHeader  from '../Component/SearchHeader';
import ViewPlaylist  from './ViewPlaylist';
import Queue         from '../../../Line/Queue';
import ContextSearch from '../../../Line/ContextSearch';

/**
 * Displays search results within the collection.
 */
class ViewSearch extends ViewPlaylist
{
    /**
     * @inheritdoc
     */
    static elementName = 'view-search';

    /**
     * @inheritdoc
     */
    async render()
    {
        this.classList.add(ViewSearch.elementName);

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
            {type: 'search', name: 'artist', placeholder: 'Artist', title: 'Artist'},
            {type: 'search', name: 'genre', placeholder: 'Genre', title: 'Genre'},
            {type: 'search', name: 'soundtrack', placeholder: 'Soundtrack', title: 'Soundtrack'}
        ]));
    }

    subRenderButtonGroup()
    {
        // maybe I should invert the inheritance...
    }

    onItemSelected(evt)
    {
        var context      = new ContextSearch(this.api, false, this.hashRequest.queryParams);
        var initialBatch = this.getPlayableItems(evt.detail.item);
        var queue        = Queue.instantiate(initialBatch, context)
        
        evt.detail.queue = queue;
    }
}

ViewSearch.register();

export default ViewSearch;
