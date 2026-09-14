import SearchHeader     from '../Component/SearchHeader';
import ListOfItems      from '../Component/ListOfItems';
import Pagination       from '../Component/Pagination';
import MusicPlayingView from './MusicPlayingView';
import Queue            from '../../../Line/Queue';
import ContextSearch    from '../../../Line/ContextSearch';

/**
 * Displays search results within the collection.
 */
class ViewSearch extends MusicPlayingView
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

        this.fetchItems().then((response) =>
        {
            this.subRenderHeader(response);
            this.subRenderItems(response);
            this.subRenderNavigation(response);
        });

        this.addEventListener('queue:intention:play-this-now', this.onItemSelected.bind(this));
    }

    /**
     * Gets the items in the playlist ( for the current page, that is ).
     *
     * @returns {Promise}
     * To be resolved when the server responds.
     */
    fetchItems()
    {
        if (this.hashRequest.queryParams.isEmpty()) {
            return new Promise((r,f)=>{return r({})});
        }

        const search = this.buildSearch(this.hashRequest.queryParams);        
        return search.fetch();
    }

    buildSearch(queryParams)
    {
        const search = this.collection.searchItems();

        var operator;
        var title = queryParams.get('title');
        if (title) {
            operator = this.getOperator(title);
            title = this.stripQuotes(title);
            search.condition('title', title, operator);
        }

        var artist = queryParams.get('artist');
        if (artist) {
            operator = this.getOperator(artist);
            artist = this.stripQuotes(artist);
            search.orConditionGroup()
                .condition('artist', artist, operator)
                .condition('featuring', artist, operator);
        }

        var genre = queryParams.get('genre');
        if (genre) {
            operator = this.getOperator(genre);
            genre = this.stripQuotes(genre);
            search.condition('genre', genre, operator);
        }

        var soundtrack = queryParams.get('soundtrack');
        if (soundtrack) {
            operator = this.getOperator(soundtrack);
            soundtrack = this.stripQuotes(soundtrack);
            search.condition('soundtrack', soundtrack, operator);
        }

        return search;
    }

    getOperator(string)
    {
        return string.match(/^ *".*" *$/)
            ? 'IN'
            : 'LIKE';
    }

    stripQuotes(string)
    {
        return string
            .replace(/^ *" */, '')
            .replace(/ *" *$/, '');
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

    async subRenderItems(response)
    {
        if (!response.data) {
            return;
        }

        this.$refs.playlist = ListOfItems.instantiate(response.data, this.collection.parent.userId);
        this.$refs.playlist.classList.add('playlist');
        if (!this.areFiltersApplied()) {
            this.$refs.playlist.setAttribute('reordable', 'true');
        }

        this.append(this.$refs.playlist);
    }

    areFiltersApplied()
    {
        return !this.hashRequest.queryParams.without('page').isEmpty();
    }

    subRenderNavigation(response)
    {
        this.$refs.pagination = Pagination.instantiate(this.hashRequest, response);
        this.append(this.$refs.pagination);

        if (this.areFiltersApplied()) {
            return;
        }

        this.$refs.pagination.querySelectorAll('.btn').forEach((el) =>
        {
            el.addEventListener('dragover', (evt) => { evt.preventDefault(); });
            el.addEventListener('drop', (evt) =>
            {
                var toPage = parseInt(el.getAttribute('data-page'));
                if (isNaN(toPage)) {
                    return;
                }

                if (this.hashRequest.queryParams.get('page') == toPage) {
                    // Already here...
                    return;
                }

                var json = evt.dataTransfer.getData('text');
                var data = JSON.parse(json);
                var offset = (toPage - 1) * this.response.meta.itemsPerPage;

                var n = 0;
                var promises = [];
                for (var item of data) {
                    item.position = n + offset;
                    promises.push(this.collection.manageItem(item.uuid).update(item));
                    n++;
                }

                Promise.all(promises).then(() =>
                {
                    console.log('playlist: reordered');
                    this.refresh();
                });

            });
        });
    }

    itemsAdded(items)
    {
        if (this.$refs.pagination.onlyOnePage || this.$refs.pagination.inTheLastPage) {
            this.refresh();
        }
    }
}

ViewSearch.register();

export default ViewSearch;
