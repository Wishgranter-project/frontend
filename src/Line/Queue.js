
/**
 * The item in front is the focus.
 * It does not leave the queue until it is time 
 * for the next in line to be in focus.
 */
class Queue extends Array 
{
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
     *   Item(s)
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
     * @return {object}
     *   Queue item.
     */
    dequeue() 
    {
        return this.removeIndex(0);
    }

    /**
     * Removes the item in the specified index and returns it.
     *
     * @return {object}
     *   Queue item.
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
     *   Queue item.
     */
    dropIn(item) 
    {
        this.jump(item, 0);
    }

    /**
     * Adds a new item to the specified position.
     *
     * @param {object|array} item 
     * @param {int} index 
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
     * Moves a single item up or down the line.
     *
     * @param int fromIndex 
     * @param int intoIndex 
     *
     * @return object
     *   The targeted item
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

        // set page 0 so it will begin from page 1.
        this.context.queryParams.set('page', 0);
        this.context.queryParams.set('orderBy', `RAND(${seed})`);
        this.context.queryParams.set('shuffle', `1`);
    }

    unshuffle()
    {
        if (!this.context) {
            return;
        }

        if (!this.context.queryParams) {
            return;
        }

        // set page 0 so it will begin from page 1.
        this.context.queryParams.set('page', 0);
        this.context.queryParams.delete('orderBy');
        this.context.queryParams.delete('shuffle');
    }

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
