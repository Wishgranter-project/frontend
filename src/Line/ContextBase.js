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
     * @param {Api} api
     * Interface with the back end.
     * @param {bool} noMore
     * Flag to indicate if there is nothing more to load, no more pages.
     */
    constructor(api, noMore = false)
    {
        this.api = api;
        this.noMore = noMore;
    }

    /**
     * Returns the context's id.
     *
     * @returns {string}
     * The id of the context.
     */
    static id()
    {
        return 'base';
    }

    /**
     * Serializes the object.
     *
     * @returns {Object}
     * Plain representation of the object.
     */
    serialize()
    {
        return {
            id: this.constructor.id(),
            noMore: this.noMore
        };
    }

    /**
     * Retrieves more items to be added to the queue.
     *
     * @param {Queue} queue 
     * The queue.
     *
     * @returns {Promise}
     * To be resolved once the request is finished.
     */
    async fetchMore(queue)
    {
        // We reached the last page,
        // let's stop here.
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

    /**
     * Progress the queue.
     *
     * @protected
     * 
     * By making whatever calculations it may be needed to in preparation to
     * fetch more items. Implementation specific.
     */
    progress()
    {
        // this.page += 1;
    }

    /**
     * Request more items.
     *
     * Implementation specific.
     *
     * @protected
     *
     * @param {Queue} queue 
     * Queue object.
     *
     * @returns {Promise}
     * To be resolved once the request is finished.
     */
    async request(queue)
    {
        // return this.api.getItems(this.page);
    }
}

export default ContextBase;
