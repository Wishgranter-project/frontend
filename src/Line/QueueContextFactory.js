import QueueContextPlaylist from './QueueContextPlaylist';
import QueueContextAlbum from './QueueContextAlbum';
import QueueContextSearch from './QueueContextSearch';

class QueueContextFactory 
{
    /**
     * @param Api api
     */
    constructor(api)
    {
        this.api = api;
    }

    instantiate(meta)
    {
        if (meta == null) {
            return null;
        }

        switch (meta.id) {
            case QueueContextPlaylist.id():
                return QueueContextPlaylist.instantiate(this.api, meta);
            case QueueContextAlbum.id():
                return QueueContextAlbum.instantiate(this.api, meta);
            case QueueContextSearch.id():
                return QueueContextSearch.instantiate(this.api, meta);
        }

        return null;
    }
}

export default QueueContextFactory;
