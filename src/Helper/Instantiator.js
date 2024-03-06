/**
 * Instantiate an object without worrying about the order of the parameters.
 */
class Instantiator 
{
    constructor(classe, dependencies)
    {
        this.classe = classe;
        this.dependencies = dependencies;
    }

    instantiate() 
    {
        var values = this.compileValues();
        return new this.classe(...values);
    }

    /**
     * @protected
     */
    compileValues()
    {
        var constructorParameters = this.getConstructorParameters();
        var values = [];

        for (var parameter of constructorParameters) {
            
            if (this.dependencies.hasOwnProperty(parameter.name)) {
                var value = this.dependencies[parameter.name];
            } else if (!parameter.noDefault) {
                var value = parameter.default;
            } else {
                throw `Could not instantiate {this.class.name}`;
            }

            values.push(value);
        }

        return values;
    }


    /**
     * @protected
     */
    getConstructorParemetersString()
    {
        return this.classe.toString().match(/constructor\(([^)]+)\)/)[1];
    }

    /**
     * @protected
     */
    getConstructorParameters()
    {
        var constuctorParameters = [];

        var parameterStrings = this.getConstructorParemetersString().split(',');

        for (var ps of parameterStrings) {
            constuctorParameters.push(this.parseParemeter(ps));
        }

        return constuctorParameters;
    }

    /**
     * @protected
     */
    parseParemeter(string)
    {
        string = this.trim(string);

        if (string.indexOf('=') < 0) {
            return {
                name: string.trim(),
                noDefault: true
            };
        }

        var parts = string.split(/ *= */);

        var parameter = {
            name: parts[0].trim(),
            default: this.parseDefaultValue(parts[1]),
            noDefault: false
        };

        return parameter;
    }

    /**
     * @protected
     */
    parseDefaultValue(string)
    {
        var value = this.trim(string);

        if (string == 'null') {
            return null;
        }

        if (string == 'false') {
            return false;
        }

        if (string == 'true') {
            return true;
        }

        if (!isNaN(string)) {
            return parseInt(string);
        }

        return value;
    }

    /**
     * @protected
     */
    trim(string) 
    {
        return string.replace(/^['"]|['"]$/g, '');
    }
}

module.exports = Instantiator;
