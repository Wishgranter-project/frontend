
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

        if (queue.length <= 1) {
            queue.fetchMore();
        }

        return queue;
    }

    /**
     * Adds item(s) to the end of the queue.
     *
     * @param {object|array} item
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
     */
    dequeue() 
    {
        return this.removeIndex(0);
    }

    /**
     * Removes the item in the specified index and returns it.
     *
     * @return {object}
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
     * @param object item 
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

    clear() 
    {
        this.splice(0, this.length);
        this.updatedCallback();
    }

    get front() 
    {
        if (this[0]) {
            return this[0];
        }
        
        console.log('Queue: end reached');
        return null;
    }

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

    //-------------------

    enqueueMultiple(items) 
    {
        this.push(...items);
        console.log('Queue: multiple items added');
        this.updatedCallback();
    }

    enqueueSingle(item) 
    {
        this.push(item);
        console.log('Queue: single item added');
        this.updatedCallback();
    }

    updatedCallback() 
    {
        console.log('queue updated');
    }
}

export default Queue;
