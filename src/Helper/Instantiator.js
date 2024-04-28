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
        var parametersString = this.getConstructorParemetersString();
        var constructorParameters = this.getConstructorParameters(parametersString);
        var values = [];

        for (var parameter of constructorParameters) {
            
            if (this.dependencies.hasOwnProperty(parameter.name)) {
                var value = this.dependencies[parameter.name];
            } else if (!parameter.noDefault) {
                var value = parameter.default;
            } else {
                // console.log(parameter);
                throw `Could not instantiate ${this.classe.name}`;
            }

            values.push(value);
        }

        return values;
    }


    /**
     * Get the parameters of the constructor method.
     *
     * @protected
     *
     * @return string
     *   E.g.: "param1, param2 = 'default value'"
     */
    getConstructorParemetersString()
    {
        return this.classe.toString().match(/constructor\(([^)]+)\)/)[1];
    }

    /**
     * Returns an array containing the parameters of the constructor.
     *
     * @protected
     *
     * @param {string} parametersString
     *   E.g.: "param1, param2 = 'default value'"
     *
     * @return array
     *   E.g.: [
     *    {
     *      name: 'param1',
     *      noDefault: true
     *    },
     *    {
     *      name: 'param2',
     *      default: 'default value'
     *    }
     *   ]
     */
    getConstructorParameters(parametersString)
    {
        var constuctorParameters = [];

        var parameterStrings = parametersString.split(',');

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

        if (string == 'false' || string == '!1') {
            return false;
        }

        if (string == 'true') {
            return true;
        }

        if (string == '{}') {
            return {};
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
