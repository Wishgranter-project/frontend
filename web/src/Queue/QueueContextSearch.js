import QueueContextBase from './QueueContextBase';

class QueueContextSearch extends QueueContextBase 
{
    constructor(api, queryParams) 
    {
        super(api);
        this.queryParams = queryParams;
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
