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

    request(method, endpoint, body = undefined, queryParams = undefined, otherOptions = undefined) 
    {
        var request;
        var options = { body, queryParams };

        if (otherOptions) {
            options = { ...options, ...otherOptions };
        }

        switch(method) {
            case 'post':
                request = this.httpClient.post(endpoint, options);
                break;
            case 'put':
                request = this.httpClient.put(endpoint, options);
                break;
            case 'delete':
                request = this.httpClient.delete(endpoint, options);
                break;
            case 'get':
                request = this.httpClient.get(endpoint, options);
                break;
        }

        return request;
    }
}

export default Base;
