import Base from './Base';

class Artists extends Base 
{
    list() 
    {
        return this.apiCall('get', '/api/v1/collection/artists');
    }
}

export default Artists;
