import Base from './Base';
import PlaylistItem from './PlaylistItem';

class PlaylistsItems extends Base 
{
    search(params) 
    {
        return this.apiCall('get', 'api/v1/collection/items', null, params);
    }

    create(data) 
    {
        return this.apiCall('post', 'api/v1/collection/items', data, null, { headers: { 'Content-Type': undefined } });
    }

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

    get(uuid) 
    {
        return new PlaylistItem(this.httpClient, uuid);
    }
}

export default PlaylistsItems;
