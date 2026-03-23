class Base
{
    /**
     * Constructor.
     * 
     * @abstract
     *
     * @param {Http} httpClient
     * A client to make http requests.
     * @param {State} state
     * State object.
     */
    constructor(httpClient, state)
    {
        this.httpClient = httpClient;
        this.state      = state;
    }

    /**
     * Makes a http call.
     *
     * @protected
     *
     * @param {string} method
     * The http method, get, post etc.
     * @param {string} endpoint
     * Path to the api endpoint.
     * @param {undefined|object|string} body
     * The body of the request.
     * @param {undefined|string|URLSearchParams} queryParams
     * Params to be added to the query string.
     * @param {object} otherOptions
     * Headers and other options.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async apiCall(method, endpoint, body = undefined, queryParams = undefined, otherOptions = undefined)
    {
        return new Promise((resolve, reject) => 
        {
            this.request(method, endpoint, body, queryParams, otherOptions).then((response) =>
            {
                return response.json().then((json) =>
                {
                    response.status < 400
                        ? resolve(json)
                        : reject(json);
                });                
            });
        });
    }

    /**
     * Makes a http requests and prompts the browser to download the response.
     *
     * @param {string} endpoint
     * Path to the api endpoint.
     * @param {undefined|string|URLSearchParams} queryParams
     * Params to be added to the query string.
     * @param {string} accept
     * Value for the Accept header.
     * @param {string} filename
     * Filename.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async downloadFile(endpoint, queryParams, accept, filename)
    {
        return this.request('get', endpoint, undefined, queryParams, { headers: { 'Accept': accept } } )
        .then(response => response.blob())
        .then(blob => {
            const fileURL = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(fileURL);
        });
    }

    /**
     * Wrapper for the httpClient.request() method.
     *
     * @protected
     *
     * @param {string} method
     * The http method, get, post etc.
     * @param {string} endpoint
     * Path to the api endpoint.
     * @param {undefined|object|string} body
     * The body of the request.
     * @param {undefined|string|URLSearchParams} queryParams
     * Params to be added to the query string.
     * @param {object} otherOptions
     * Headers and other options.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    request(method, endpoint, body = undefined, queryParams = undefined, otherOptions = undefined)
    {
        var options = { method, body, queryParams };

        if (otherOptions) {
            options = { ...options, ...otherOptions };
        }

        if (options.headers) {
            options.headers = { ...this.httpClient.defaultOptions.headers, ...options.headers };
        }

        var promise = this.httpClient.request(endpoint, options);
        return promise;
    }
}

export default Base;
