import QueueContextBase from './QueueContextBase';

class QueueContextSearch extends QueueContextBase 
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
            id: QueueContextSearch.id(),
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

export default QueueContextSearch;
