/**
 * 
 */
class QueueContextBase 
{
    /**
     * @param Api api
     */
    constructor(api) 
    {
        this.api = api;
        this.noMore = false;
    }

    static id() 
    {
        return 'base';
    }

    // To help us serialize the object.
    serialize() 
    {
        return {
            id: QueueContextBase.id(),
            noMore: this.noMore
        };
    }

    static unserialize(api, obj) 
    {
        var context = new QueueContextBase(api);
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
