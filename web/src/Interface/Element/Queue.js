
class Queue extends Array 
{
    constructor(...args) 
    {
        super(...args);
        this.context = null;
        this.fetchingPromise = null;
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

    setContext(queueContext) 
    {
        this.context = queueContext;
        console.log('Queue: context set');
        this.clear();
        this.enqueue(queueContext.initialBatch);
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

    clear() 
    {
        console.log('Queue: emptied');
        this.splice(0, this.length);
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
