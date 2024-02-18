import Collection from './Collection';
import Discover from './Discover';
const Http = require('http');

class Api 
{
    constructor(baseHref) 
    {
        var defaultOptions = {
            baseHref,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var httpClient  = new Http(defaultOptions);
        this.collection = new Collection(httpClient);
        this.discover   = new Discover(httpClient);
    }
}

export default Api;
