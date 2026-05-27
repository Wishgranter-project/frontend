import ContextSearch from './ContextSearch';

class ContextPlaylist extends ContextSearch
{
    /**
     * Constructor.
     *
     * @param {Collection} collection
     * The user's collection.
     * @param {bool} noMore
     * Flag, indicates there is nothing more to load, no more pages.
     * @param {URLSearchParams|string} queryParams
     * Query string to use in the search.
     * @param {string} playlistId
     * The playlist we are aiming for.
     */
    constructor(collection, noMore = false, queryParams, playlistId)
    {
        super(collection, noMore, queryParams);
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
        return this.collection.fetchPlaylistItems(this.queryParams, { playlist: this.playlistId });
    }
}

export default ContextPlaylist;
