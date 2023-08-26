import Base from './Base';

class PlaylistItem extends Base 
{
    constructor(httpClient, uuid) 
    {
        super(httpClient);
        this.uuid = uuid;
    }

    read() 
    {
        return this.apiCall('get', '/api/v1/collection/items/' + this.uuid);
    }

    update(data) 
    {
        return this.apiCall('put', '/api/v1/collection/items/' + this.uuid, data, null, { headers: { 'Content-Type': undefined } });
    }

    delete() 
    {
        return this.apiCall('delete', '/api/v1/collection/items/' + this.uuid);
    }
}

export default PlaylistItem;
