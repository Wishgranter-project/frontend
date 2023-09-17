import QueueContextBase from './QueueContextBase';

class QueueContextSearch extends QueueContextBase 
{
    constructor(initialBatch, api, queryParams) 
    {
        super(initialBatch, api);
        this.queryParams = queryParams;
    }

    async request(queue) 
    {
        return this.api.collection.playlistItems.search(this.queryParams);
    }

    progress() 
    {
        var page = parseInt(this.queryParams.get('page') || 1) + 1;
        this.queryParams.set('page', page);
    }
}

export default QueueContextSearch;
