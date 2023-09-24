
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
        if (this[0]) {
            return this[0];
        }
        
        console.log('History: end reached');
        return null;
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
