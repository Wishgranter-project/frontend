import ContextSearch from './ContextSearch';

class ContextPlaylist extends ContextSearch 
{
    /**
     * Constructor.
     *
     * @param {Api} api
     *   Interface with the back end.
     * @param {bool} noMore
     *   Flag, indicates there is nothing more to load, no more pages.
     * @param {URLSearchParams|string} queryString
     *   Query string to use in the search.
     * @param {string} playlistId
     *   The playlist we are aiming for.
     */
    constructor(api, noMore = false, queryParams, playlistId) 
    {
        super(api, noMore, queryParams);
        this.playlistId = playlistId;
    }

    static id() 
    {
        return 'playlist';
    }

    serialize() 
    {
        return {
            id: ContextPlaylist.id(),
            noMore: this.noMore,
            queryParams: (this.queryParams ? this.queryParams.toString() : ''),
            playlistId: this.playlistId
        };
    }

    // protected
    //-------------------
    async request(queue) 
    {
        return this.api.collection.playlists
            .get(this.playlistId)
            .getItems(this.queryParams);
    }
}

export default ContextPlaylist;
