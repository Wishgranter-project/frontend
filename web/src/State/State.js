class State 
{
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

    set(variable, value) 
    {
        this.data[variable] = value;
        this.save();
    }

    save() 
    {
        var json = JSON.stringify(this.data);
        localStorage.setItem(this.name, json);
    }

    load() 
    {
        this.data = this.retrieve() || this.data;
    }

    retrieve() 
    {
        var json = localStorage.getItem(this.name);

        return json
            ? JSON.parse(json)
            : {};
    }
}

export default State;