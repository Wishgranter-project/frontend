
class QueueContextPlaylist 
{
    constructor(initialBatch, api, playlistId, queryParams) 
    {
        this.initialBatch = initialBatch;
        this.api = api;
        this.playlistId = playlistId;
        this.queryParams = queryParams;
    }

    fetchMore(queue) 
    {
        this.progress();
        return this.api.collection.playlists.get(this.playlistId).getItems(this.queryParams);
    }

    progress() 
    {
        var page = parseInt(this.queryParams.get('page') || 1);
        page += 1;
        this.queryParams.set('page', page);
    }
}

export default QueueContextPlaylist;
