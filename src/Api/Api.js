import Collection from './Collection';
import Discover   from './Discover';
import Http       from 'http';

/**
 * The api to communicate with the back-end.
 */
class Api
{
    /**
     * Constructor.
     *
     * @param {string} baseHref
     * The base for all the URLs we will be using.
     */
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
