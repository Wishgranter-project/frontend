/**
 * @abstract
 *
 * A queue context knows how to fetch more items.
 * It is used maily for pagination.
 */
class ContextBase
{
    /**
     * Constructor.
     *
     * @param Api api
     *   Interface with the back end.
     * @param bool noMore
     *   Flag, indicates there is nothing more to load, no more pages.
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

    /**
     * @param ContextBase queue 
     * 
     * @return Promise
     */
    async fetchMore(queue) 
    {
        // We reached the last page.
        if (this.noMore) {
            return new Promise((success, fail) => 
            {
                return success({ data: [] });
            });
        }

        this.progress();

        return this.request(queue).then((response) => 
        {
            // console.log(response);
            if (!response.data || response.data.length == 0) {
                this.noMore = true;
            }

            return response;
        });
    }

    // protected
    //-------------------

    /**
     * make whatever calculations may be needed to reach in
     * preparation to fetch more items.
     */
    progress()
    {
        // this.page += 1;
    }

    /**
     * Request more items.
     *
     * @param Queue queue 
     *   Queue object.
     *
     * @return Promise
     *   Response to API request.
     */
    async request(queue) 
    {
        // return this.api.getItems(this.page);
    }
}

export default ContextBase;
