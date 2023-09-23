
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
        var last = this[0] || null;
        this.splice(0, 1);
        return last;
    }

    get theOneInFront() 
    {
        if (this[0]) {
            return this[0];
        }
        
        console.log('Queue: end reached');
        return null;
    }

    async advance() 
    {
        var previous = this.theOneInFront;

        this.dequeue();

        if (this.length > 1) {
            return new Promise((success, fail) =>
            {
                return success(previous);
            });
        }

        return this.fetchMore().then( () => 
        {
            return previous;
        });
    }

    async fetchMore() 
    {
        console.log('Queue: Searching for more content')

        if (this.fetchingPromise) {
            return this.fetchingPromise;
        }

        return this.fetchingPromise = this.context.fetchMore(this).then( (response) => 
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

    clear(fromKey = 0) 
    {
        console.log('Queue: emptied');
        this.splice(fromKey, this.length);
    }

    //-------------------

    enqueueMultiple(items) 
    {
        this.push(...items);
        console.log('Queue: multiple items added');
    }

    enqueueSingle(item) 
    {
        this.push(item);
        console.log('Queue: single item added');
    }
}

export default Queue;
