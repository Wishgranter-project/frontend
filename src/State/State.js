/**
 * A logical data structure.
 *
 * Mainly for organizational purposes.
 * 
 * Data is saved in the browser's localstorage.
 */
class State
{
    /**
     * @param {string} name
     *   Name of the collection.
     * @param {Object} data
     *   Default data in case there's nothing in storage.
     */
    constructor(name, data = null)
    {
        this.name = name;
        this.data = data || this.retrieve();
    }

    /**
     * Retrieves data from the state.
     *
     * @param {string} variable
     *   Variable name.
     * @param {*} defaultValue
     *   Default value in case there's nothing there.
     *
     * @returns {*}
     *   Data stored or the defaultValue.
     */
    get(variable, defaultValue = null)
    {
        if (this.data[variable] == undefined) {
            return defaultValue;
        }

        return this.data[variable];
    }

    /**
     * Retrieves int from the state.
     *
     * @param {string} variable
     *   Variable name.
     * @param {integer} defaultValue
     *   Default value in case there's nothing there.
     *
     * @returns {integer}
     *   Data stored or the defaultValue.
     */
    getInt(variable, defaultValue = 0)
    {
        return parseInt(this.get(variable, defaultValue));
    }

    /**
     * Set a new value into the storage.
     *
     * @param {string} variable
     *   Variable name.
     * @param {mixed} value
     *   The value to be introduced.
     */
    set(variable, value)
    {
        this.data[variable] = value;
        this.save();
    }

    // ========================================================================

    /**
     * Saves the data into localstorage.
     *
     * @private
     */
    save()
    {
        var json = JSON.stringify(this.data);
        localStorage.setItem(this.name, json);
    }

    /**
     * Loads the data from localstorage.
     *
     * @private
     *
     * @return {Object}
     */
    retrieve()
    {
        var json = localStorage.getItem(this.name);

        return json
            ? JSON.parse(json)
            : {};
    }
}

export default State;