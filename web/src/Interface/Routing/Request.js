class Request 
{
    /**
     * @param {string} path 
     * @param {object} queryParams 
     */
    constructor(path, queryParams) 
    {
        this.path        = path;
        this.queryParams = queryParams;
        this.attributes  = {}
    }

    /**
     * @return {Request}
     */
    static createFromGlobals() 
    {
        if (! location.hash) {
            return new Request('', new URLSearchParams(''));
        }

        var url = new URL(location.hash.replace('#', '/'), 'https://' + location.hostname);

        return new Request(url.pathname.replace(/^\//, '#'), new URLSearchParams(url.search));
    }
}

export default Request;
