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
