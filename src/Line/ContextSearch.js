import ContextBase from './ContextBase';

class ContextSearch extends ContextBase 
{
    constructor(api, noMore = false, queryParams) 
    {
        super(api, noMore);
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

    progress() 
    {
        var page = parseInt(this.queryParams.get('page') || 1) + 1;
        this.queryParams.set('page', page);
    }

    async request(queue) 
    {
        return this.api.collection.playlistItems.search(this.queryParams);
    }
}

export default ContextSearch;
