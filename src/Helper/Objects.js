/**
 * Helper class to validate values.
 */
class Objects
{
    /**
     * Checks if subject is an instance of a specific class.
     *
     * @param {object} subject
     * Our data.
     * @param {string|function} whatItIs 
     * Class to compare.
     *
     * @returns {bool}
     * True if it is.
     */
    static isA(subject, whatItIs)
    {
        var proto = subject.__proto__;

        while (proto) {
            if (
                (typeof whatItIs == 'string'   && proto.name == whatItIs) ||
                (typeof whatItIs == 'function' && proto.name == whatItIs.name)
            ) {
                return true;
            }

            proto = proto.__proto__;
        }

        return false;
    }
}

module.exports = Objects;
