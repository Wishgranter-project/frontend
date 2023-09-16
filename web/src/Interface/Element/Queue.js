
class Queue 
{
    constructor(items = []) 
    {
        this.list = items;
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
        var last = this.list[0] || null;
        this.list = this.list.slice(1);

        if (this.list.length == 1) {
            this.fetchMore();
        }

        return last;
    }

    get theOneInFront() 
    {
        return this.list[0] || null;
    }

    setContext(context) 
    {
        this.clear();
        this.enqueueMultiple(context.initialBatch);
        this.context = context;
    }

    fetchMore() 
    {
        this.context.fetchMore(this).then( (response) => 
        {
            this.enqueueMultiple(response.data)
        });
    }

    clear() 
    {
        this.list = [];
    }

    //-------------------

    enqueueMultiple(items) 
    {
        this.list = [...this.list, ...items];
    }

    enqueueSingle(item) 
    {
        this.list.push(item);
    }
}

export default Queue;
