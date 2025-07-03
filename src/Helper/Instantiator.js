/**
 * Helper class to instantiate objects without worrying about the order of the parameters.
 *
 * @class
 */
class Instantiator
{
    /**
     * Constructor
     *
     * @param {string} classe
     * The class to instantiate.
     * @param {array} dependencies
     * Dependencies to be injected as parameters to the class' constructor.
     */
    constructor(classe, dependencies)
    {
        this.classe = classe;
        this.dependencies = dependencies;
    }

    /**
     * Instantiates the object.
     *
     * @returns {object}
     * The instantiated object.
     */
    instantiate()
    {
        var values = this.compileValues();
        return new this.classe(...values);
    }

    /**
     * Compiles the dependencies in the correct order.
     *
     * @protected
     *
     * @returns {array}
     * The dependencies in the correct order.
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
     * Get the parameters of the constructor.
     *
     * As a string like this: "param1, param2 = 'default value'"
     *
     * @protected
     *
     * @returns {string}
     * The parameter definitions.
     */
    getConstructorParemetersString()
    {
        return this.classe.toString().match(/constructor\(([^)]+)\)/)[1];
    }

    /**
     * Parses a string of parameters into an array.
     *
     * @protected
     *
     * @param {string} parametersString
     * E.g.: "param1, param2 = 'default value'"
     *
     * @returns {array}
     * E.g.: [
     *    {
     *      name: 'param1',
     *      noDefault: true
     *    },
     *    {
     *      name: 'param2',
     *      default: 'default value'
     *    }
     * ]
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
     * Parses a parameter.
     *
     * @param {string} string
     * The paremeter. E.g.: param2 = 'default value'
     *
     * @protected
     *
     * @returns {object}
     * The parsed parameter.
     * E.g.: {
     *   name: 'param2',
     *   default: 'default value'
     * }
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
     * Parses the default value of a parameter.
     *
     * @param {string} string
     * The default value represented as a string.
     *
     * @protected
     *
     * @returns {*}
     * Bool, int, null...
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
     * Trims quotes out of a string.
     *
     * @protected
     *
     * @param {string} string
     * The string to be trimmed.
     *
     * @returns {string}
     * The trimmed string.
     */
    trim(string)
    {
        return string.replace(/^['"]|['"]$/g, '');
    }
}

module.exports = Instantiator;
