import ContextBase from './ContextBase';
import SearchHelper from '../Helper/SearchHelper';

class ContextSearch extends ContextBase
{
    /**
     * Constructor.
     *
     * @param {Api} api
     * Api to communicate with the backend.
     * @param {bool} noMore
     * Flag, indicates there is nothing more to load, no more pages.
     * @param {URLSearchParams|string} queryParams
     * Query string to use in the search.
     */
    constructor(api, noMore = false, queryParams)
    {
        super(noMore);
        this.api = api;
        this.queryParams = typeof queryParams == 'string'
            ? new URLSearchParams(queryParams)
            : queryParams;
    }

    static id()
    {
        return 'search';
    }

    serialize()
    {
        return {
            id: ContextSearch.id(),
            noMore: this.noMore,
            queryParams: (this.queryParams ? this.queryParams.toString() : ''),
        };
    }

    // protected
    //-------------------
    progress()
    {
        var page = parseInt(this.queryParams.get('page') || 1) + 1;
        this.queryParams.set('page', page);
    }

    async request(queue)
    {
        const search = this.buildSearch();
        return search.fetch();
    }

    buildSearch()
    {
        const search = this.api.manageUser().collection.searchItems();
        SearchHelper.populateSearch(search, this.queryParams);

        return search;
    }
}

export default ContextSearch;
