import Collection from './Collection';
import Discover   from './Discover';
import User       from './User';
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
     * @param {State} state
     * State object.
     */
    constructor(baseHref, state)
    {
        var defaultOptions = {
            baseHref,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (state.get('session')) {
            defaultOptions.headers.Authorization = state.get('session');
        }

        var httpClient  = new Http(defaultOptions);
        this.collection = new Collection(httpClient, state);
        this.discover   = new Discover(httpClient, state);
        this.user       = new User(httpClient, state);
    }
}

export default Api;
