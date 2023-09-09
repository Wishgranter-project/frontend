
class Queue 
{
    constructor(items = []) 
    {
        this.list = items;
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

        return last;
    }

    peek() 
    {
        return this.list[0] || null;
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
