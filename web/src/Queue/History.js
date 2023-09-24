
class History extends Array 
{
    add(item) 
    {
        Array.isArray(item)
            ? this.addMultiple(item)
            : this.addSingle(item);
    }

    get theMostRecent() 
    {
        return this.length
            ? this[0]
            : null;
    }

    get theOldest() 
    {
        return this.length
            ? this[this.length - 1]
            : null;
    }

    rewind(length = 1) 
    {
        return this.splice(0, length);
    }

    //-------------------

    addMultiple(items) 
    {
        this.splice(0, 0, ...items);
        console.log('History: multiple items added');
        this.updatedCallback();
    }

    addSingle(item) 
    {
        this.splice(0, 0, item);
        console.log('History: single item added');
        this.updatedCallback();
    }

    updatedCallback() 
    {
        console.log('history updated');
    }
}

export default History;
