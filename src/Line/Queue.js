
/**
 * The item in front is the focus.
 * It does not leave the queue until it is time 
 * for the next in line to be in focus.
 */
class Queue extends Array
{
    /**
     * Instantiates a new queue.
     *
     * @param {array} items
     * Array of playlist items.
     * @param {ContextBase} queueContext
     * The context of the queue.
     *
     * @returns {Queue}
     * The new queue object.
     */
    static instantiate(items = [], queueContext)
    {
        var queue = new Queue();
        queue.enqueue(items);
        queue.context = queueContext;
        queue.fetchingPromise = null;

        return queue;
    }

    /**
     * Adds item(s) to the end of the queue.
     *
     * @param {object|array} item
     * Item(s) to add to the queue.
     */
    enqueue(item)
    {
        Array.isArray(item)
            ? this.enqueueMultiple(item)
            : this.enqueueSingle(item);
    }

    /**
     * Removes the item in front ( index 0 ) and returns it.
     *
     * @returns {object}
     * The removed item.
     */
    dequeue()
    {
        return this.removeIndex(0);
    }

    /**
     * Removes the item in the specified index and returns it.
     *
     * @param {int} index
     * The index to remove.
     *
     * @returns {object}
     * The removed item.
     */
    removeIndex(index)
    {
        var removedItem = this[index] || null;
        this.splice(index, 1);
        this.updatedCallback();
        return removedItem;
    }

    /**
     * Adds a new item to the very beginning of the queue.
     *
     * @param {object} item 
     * Item to be added.
     */
    dropIn(item)
    {
        this.jump(item, 0);
    }

    /**
     * Adds new item(s) to the specified position.
     *
     * @param {object|array} item
     * The item(s) to add to the queue.
     *
     * @param {int} index
     * The index we are aiming for.
     */
    jump(item, index = 1)
    {
        if (Array.isArray(item)) {
            // var params = [index, 0].concat(item);
            // this.splice([...params]);
            for (var i = 0; i < item.length; i++) {
                this.jump(item[i], i);
            }
        } else {
            this.splice(index, 0, item);
        }

        this.updatedCallback();
    }

    /**
     * Moves a single item up or down the queue and returns it.
     *
     * @param {int} fromIndex
     * From pisition.
     * @param {int} intoIndex 
     * To this position.
     * 
     * @returns {object}
     * The moved queue item.
     */
    move(fromIndex, intoIndex = 0)
    {
        console.log(`movin queue item from ${fromIndex} to position ${intoIndex}`);
        var target = this.splice(fromIndex, 1)[0];
        this.splice(intoIndex, 0, target);
        this.updatedCallback();
        return target;
    }

    /**
     * Gets the position a specific item finds itself in.
     *
     * @param {object} item
     *
     * @return {int}
     *   The position.
     */
    getPosition(item)
    {
        for (var i = 0; i < this.length; i++) {
            if (
                item == this[i] ||
                (item.uuid && this[i].uuid && item.uuid == this[i].uuid)
            ) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Empties the queue.
     */
    clear()
    {
        this.splice(0, this.length);
        this.updatedCallback();
    }

    /**
     * Returns the first item in the queue.
     *
     * @return {object}
     *   Queue item.
     */
    get front()
    {
        if (this[0]) {
            return this[0];
        }
        
        console.log('Queue: end reached');
        return null;
    }

    /**
     * Returns the last item in the queue.
     *
     * @return {object}
     *   Queue item.
     */
    get back()
    {
        return this.length
            ? this[this.length - 1]
            : null;
    }

    /**
     * Returns the next item in the queue.
     *
     * Fetches it from the server if necessary.
     * 
     * @returns {Promise}
     *   To be resolved when the back-end responds.
     */
    async getNextInLine()
    {
        if (this.length >= 2) {
            return new Promise((success, fail) =>
            {
                return success(this[1]);
            });
        }

        return this.fetchMore().then( (response) => 
        {
            return this[1] || null;
        });
    }

    /**
     * Requests more items to be added to the queue.
     *
     * @returns {Promise}
     *   To be resolved when the back-end responds.
     */
    async fetchMore()
    {
        console.log('Queue: Searching for more content')

        // Just fucking wait.
        if (this.fetchingPromise) {
            return this.fetchingPromise;
        }

        // No context, just return an empty array.
        if (!this.context) {
            return new Promise((success, fail) => 
            {
                success([]);
            });
        }

        return this.fetchingPromise = 
        this.context.fetchMore(this).then((response) => 
        {
            this.fetchingPromise = null;

            if (response.data && response.data.length) {
                this.enqueue(response.data);
            } else {
                console.log('Queue: nothig more to add to the queue');
            }

            return response;
        });
    }

    /**
     * Checks if the queue is shuffled.
     *
     * @returns {bool}
     *   True if it is shuffled.
     */
    isShuffled()
    {
        if (!this.context) {
            return false;
        }

        if (!this.context.queryParams) {
            return false;
        }

        return this.context.queryParams.get('shuffle') == '1';
    }

    /**
     * Shuffles the queue.
     *
     * @param {bool} reset
     *   If true, removes all but the first item of the queue.
     */
    shuffle(reset = false)
    {
        if (!this.context) {
            return;
        }

        if (!this.context.queryParams) {
            return;
        }

        var seed = this.generateRandomSeed();

        if (reset) {
            // Leaves the first item only.
            this.splice(1);
        }

        // set page 0 so it will begin from the first page.
        this.context.queryParams.set('page', 0);
        this.context.queryParams.set('orderBy', `RAND(${seed})`);
        this.context.queryParams.set('shuffle', `1`);
    }

    /**
     * Unshuffles the queue.
     */
    unshuffle()
    {
        if (!this.context) {
            return;
        }

        if (!this.context.queryParams) {
            return;
        }

        // set page 0 so it will begin from the first page.
        this.context.queryParams.set('page', 0);
        this.context.queryParams.delete('orderBy');
        this.context.queryParams.delete('shuffle');
    }

    /**
     * Generates a random seet to order the queue.
     *
     * @returns {string}
     *   A random seed.
     */
    generateRandomSeed()
    {
        // Generates an uuid, but it will serve for now.
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

    // protected
    //-------------------

    /**
     * Adds multiple item to the queue.
     *
     * @param {Array} items
     *   Queue items.
     */
    enqueueMultiple(items)
    {
        this.push(...items);
        console.log('Queue: multiple items added');
        this.updatedCallback();
    }

    /**
     * Adds an item to the queue.
     *
     * @param {object} item 
     *   Queue item.
     */
    enqueueSingle(item)
    {
        this.push(item);
        console.log('Queue: single item added');
        this.updatedCallback();
    }

    /**
     * For debugging.
     */
    updatedCallback()
    {
        console.log('queue updated');
    }
}

export default Queue;
