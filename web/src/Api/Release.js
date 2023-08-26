import Base from './Base';

class Release extends Base 
{
    constructor(httpClient, releaseId) 
    {
        super(httpClient);
        this.releaseId = releaseId;
    }

    getTracks(params = null) 
    {
        return this.apiCall('get', '/api/v1/discover/releases/' + this.releaseId, null, params);
    }
}

export default Release;
