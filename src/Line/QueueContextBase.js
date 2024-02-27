/**
 * 
 */
class QueueContextBase 
{
    /**
     * @param Api api
     */
    constructor(api, noMore = false) 
    {
        this.api = api;
        this.noMore = noMore;
    }

    static id() 
    {
        return 'base';
    }

    // To help us serialize the object.
    serialize() 
    {
        return {
            id: this.constructor.id(),
            noMore: this.noMore
        };
    }

    static instantiate(api, obj) 
    {
        var parameters = Object.values(obj);
        parameters.splice(0, 1, api); // replace id by api

        var context = new this(...parameters);
        return context;
    }

    /**
     * make whatever calculations may be needed to reach in
     * preparation to fetch more items.
     */
    progress() 
    {
        // this.page += 1;
    }

    /**
     * @param QueueContextBase queue 
     * 
     * @return Promise
     */
    async fetchMore(queue) 
    {
        if (this.noMore) {
            return new Promise((success, fail) => 
            {
                return success({ data: [] });
            });
        }

        this.progress();

        return this.request(queue).then((response) => 
        {
            console.log(response);
            if (!response.data || response.data.length == 0) {
                this.noMore = true;
            }

            return response;
        });
    }

    /**
     * @param QueueContextBase queue 
     * 
     * @return Promise
     */
    async request(queue) 
    {
        // return this.api.getItems(this.page);
    }
}

export default QueueContextBase;
