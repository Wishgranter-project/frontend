import QueueContextSearch from './QueueContextSearch';

class QueueContextPlaylist extends QueueContextSearch 
{
    constructor(api, queryParams, playlistId) 
    {
        super(api, queryParams);
        this.playlistId = playlistId;
    }

    static id() 
    {
        return 'playlist';
    }

    serialize() 
    {
        return {
            id: QueueContextPlaylist.id(),
            noMore: this.noMore,
            queryParams: (this.queryParams ? this.queryParams.toString() : ''),
            playlistId: this.playlistId
        };
    }

    static unserialize(api, obj) 
    {
        var context = new QueueContextPlaylist(api, new URLSearchParams(obj.queryParams), obj.playlistId);
        context.noMore = obj.noMore;
        return context;
    }

    async request(queue) 
    {
        return this.api.collection.playlists
            .get(this.playlistId)
            .getItems(this.queryParams);
    }
}

export default QueueContextPlaylist;
