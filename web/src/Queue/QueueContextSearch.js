import QueueContextBase from './QueueContextBase';

class QueueContextSearch extends QueueContextBase 
{
    constructor(api, queryParams) 
    {
        super(api);
        this.queryParams = queryParams;
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

    static unserialize(api, obj) 
    {
        var context = new QueueContextSearch(api, new URLSearchParams(obj.queryParams));
        context.noMore = obj.noMore;
        return context;
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
