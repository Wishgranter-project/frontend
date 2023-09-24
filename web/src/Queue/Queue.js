
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

    enqueue(item) 
    {
        Array.isArray(item)
            ? this.enqueueMultiple(item)
            : this.enqueueSingle(item);
    }

    dequeue() 
    {
        var previousFrontOfTheLine = this[0] || null;
        this.splice(0, 1);
        this.updatedCallback();
        return previousFrontOfTheLine;
    }

    /**
     * Adds a new item to the very beginning of the queue.
     *
     * @param object item 
     */
    dropIn(item) 
    {
        this.queue.splice(0, 0, item);
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
        console.log(fromIndex, intoIndex);
        var target = this.splice(fromIndex, 1)[0];
        this.splice(intoIndex, 0, target);
        this.updatedCallback();
        return target;
    }

    get front() 
    {
        if (this[0]) {
            return this[0];
        }
        
        console.log('Queue: end reached');
        return null;
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

        if (this.fetchingPromise) {
            return this.fetchingPromise;
        }

        return this.fetchingPromise = 
               this.context.fetchMore(this).then( (response) => 
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
