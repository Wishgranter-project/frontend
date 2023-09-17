
class Queue 
{
    constructor(items = []) 
    {
        this.items = items;
        this.context = null;
    }

    enqueue(item) 
    {
        Array.isArray(item)
            ? this.enqueueMultiple(item)
            : this.enqueueSingle(item);
    }

    dequeue() 
    {
        var last = this.items[0] || null;
        this.items = this.items.slice(1);

        if (this.items.length <= 1) {
            this.fetchMore();
        }

        return last;
    }

    get length() 
    {
        return this.items.length;
    }

    get theOneInFront() 
    {
        if (this.items[0]) {
            return this.items[0];
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
        return this.context.fetchMore(this).then( (response) => 
        {
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
        this.items = [];
    }

    //-------------------

    enqueueMultiple(items) 
    {
        this.items = [...this.items, ...items];
        console.log('Queue: multiple items added');
    }

    enqueueSingle(item) 
    {
        this.items.push(item);
        console.log('Queue: single item added');
    }
}

export default Queue;
