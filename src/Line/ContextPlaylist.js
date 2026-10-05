import ContextSearch from './ContextSearch';
import SearchHelper from '../Helper/SearchHelper';

class ContextPlaylist extends ContextSearch
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
     * @param {string} playlistId
     * The playlist we are aiming for.
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

    buildSearch()
    {
        const search = super.buildSearch();
        search.condition('playlistId', this.playlistId);

        return search;
    }
}

export default ContextPlaylist;
