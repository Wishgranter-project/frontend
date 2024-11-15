class Base 
{
    constructor(httpClient) 
    {
        this.httpClient = httpClient;
    }

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

    async download(endpoint, queryParams, accept)
    {
        return this.request('get', endpoint, undefined, queryParams, { headers: { 'Accept': accept } } )
        .then(response => response.blob())
        .then(blob => {
            const file = URL.createObjectURL(blob);
            window.location.assign(file);
        });
    }

    request(method, endpoint, body = undefined, queryParams = undefined, otherOptions = undefined) 
    {
        var request;
        var options = { method, body, queryParams };

        if (otherOptions) {
            options = { ...options, ...otherOptions };
        }

        var promise = this.httpClient.request(endpoint, options);
        return promise;
    }
}

export default Base;
