import Base from './Base';
import PlaylistItem from './PlaylistItem';

class PlaylistsItems extends Base
{
    /**
     * Searches for playlist items.
     *
     * @param {object} params
     * Parameters to filter and paginate. Playlist, artist, genre, etc.
     * 
     @returns {Promise}
     * To be resolved when the back-end responds.
     */
    search(params)
    {
        return this.apiCall('get', 'api/v1/collection/items', null, params);
    }

    /**
     * Creates a new playlist item.
     *
     * @param {object} data
     * The playlist item details. Title, artist, genre, etc.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    create(data)
    {
        return this.apiCall('post', 'api/v1/collection/items', data, null, {
            // To avoid the http client converting the body into json.
            headers: { 'Content-Type': undefined }
        });
    }

    /**
     * Adds a list of playlist items to a specified playlist.
     *
     * @param {array} items
     * Array of playlist items.
     * @param {string} playlistId
     * The id of the playlist to add the items to.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    addMultiple(items, playlistId)
    {
        var promise;
        var promises = [];
        var i;

        for (var item of items) {

            if (item.uuid) {
                promise = this.create({ playlist: playlistId, uuid: item.uuid });
            } else {

                i = {
                    playlist: playlistId,
                    artist: item.artist
                };

                if (item.title) {
                    i.title = item.title;
                }

                if (item.album) {
                    i.album = item.album;
                }

                promise = this.create(i);
            }

            promises.push(promise);
        }

        return Promise.all(promises);
    }

    /**
     * Instantiate a new Playlist object.
     *
     * @param {string} uuid
     * The playlist item uuid.
     *
     * @returns {PlaylistItem}
     * The playlist item object.
     */
    get(uuid)
    {
        return new PlaylistItem(this.httpClient, uuid);
    }
}

export default PlaylistsItems;
