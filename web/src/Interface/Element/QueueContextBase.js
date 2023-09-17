/**
 * 
 */
class QueueContextBase 
{
    /**
     * @param array initialBatch 
     *   Array of playlist items.
     *
     * @param Api api
     */
    constructor(initialBatch, api) 
    {
        this.noMore = false;

        this.initialBatch = initialBatch;
        this.api = api;
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
    async request(queue) 
    {
        // return this.api.getItems(this.page);
    }
}

export default QueueContextBase;
