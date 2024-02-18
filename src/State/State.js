class State 
{
    /**
     * @param {string} name
     * @param {Object} data
     *   Usefull when we want use default info.
     */
    constructor(name, data = null) 
    {
        this.name = name;
        this.data = data || this.retrieve();
    }

    get(variable, defaultValue = null) 
    {
        if (this.data[variable] == undefined) {
            return defaultValue;
        }

        return this.data[variable];
    }

    getInt(variable, defaultValue = 0) 
    {
        return parseInt(this.get(variable, defaultValue));
    }

    /**
     * @param {string} variable 
     * @param {mixed} value
     */
    set(variable, value) 
    {
        this.data[variable] = value;
        this.save();
    }

    // ========================================================================

    /**
     * @private
     */
    save() 
    {
        var json = JSON.stringify(this.data);
        localStorage.setItem(this.name, json);
    }

    /**
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