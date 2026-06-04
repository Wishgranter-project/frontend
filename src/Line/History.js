
class History extends Array
{
    /**
     * Add item(s) to the history.
     *
     * @param {Object|Array} items
     * Items to be added.
     */
    add(items)
    {
        Array.isArray(items)
            ? this.addMultiple(items)
            : this.addSingle(items);
    }

    /**
     * Returns the most recent item added to the history.
     *
     * @returns {Object|null}
     * The most recent item, or null if the history is empty.
     */
    get theMostRecent()
    {
        return this.length
            ? this[0]
            : null;
    }

    /**
     * Returns the oldest item in the history.
     *
     * @returns {Object|null}
     * The most oldest item, or null if the history is empty.
     */
    get theOldest()
    {
        return this.length
            ? this[this.length - 1]
            : null;
    }

    /**
     * Rewinds the history by removing items from the history.
     *
     * @param {Int} length
     * How many items should be removed.
     *
     * @returns {Array}
     * The removed items.
     */
    rewind(length = 1)
    {
        var items = this.splice(0, length);
        this.updatedCallback();
        return items;
    }

    /**
     * Clears the history by emptying it.
     */
    clear()
    {
        this.splice(0, this.length);
        this.updatedCallback();
    }

    /**
     * Callback invoked when the history's contents are updated.
     */
    updatedCallback()
    {
        console.log('history updated');
    }

    //-------------------

    /**
     * Add multiple items to the history.
     *
     * @protected
     *
     * @param {Array} items
     * Items to be added.
     */
    addMultiple(items)
    {
        this.splice(0, 0, ...items);
        console.log('History: multiple items added');
        this.updatedCallback();
    }

    /**
     * Adds a single item to the history.
     *
     * @protected
     *
     * @param {Object} item
     * The item to be added.
     */
    addSingle(item)
    {
        this.splice(0, 0, item);
        console.log('History: single item added');
        this.updatedCallback();
    }
}

export default History;
