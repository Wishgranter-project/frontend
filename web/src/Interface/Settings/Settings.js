class Settings 
{
    constructor(name, data = null) 
    {
        this.name = name;

        if (data) {
            this.data = data
        } else {
            this.load();
        }
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
        var json = localStorage.getItem(this.name);
        return this.data = json
            ? JSON.parse(json)
            : {};
    }
}

export default Settings;