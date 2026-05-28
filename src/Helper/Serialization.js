import {HashRequest} from 'tabbed-router';

/**
 * Helper class to serialize things.
 */
class Serialization
{
    /**
     * Serializes data.
     *
     * @param {*} data
     * Arbitrary data.
     *
     * @returns {object}
     * Flat representation.
     */
    static serialize(data)
    {
        const implementsSerelizationMethod = typeof data.serialize == 'function';

        return implementsSerelizationMethod
            ? data.serialize()
            : Serialization.serializeFallback(data);
    }

    /**
     * Fallback.
     *
     * @protected
     * 
     * @param {*} data
     * Arbitrary data.
     *
     * @returns {object}
     * Flat representation.
     */
    static serializeFallback(data)
    {
        if (data.constructor.name == HashRequest.name) {
            return {
                path:         data.path,
                queryParams: (data.queryParams ? data.queryParams.toString() : ''),
                attributes:   data.attributes,
                meta:         data.meta
            }
        }

        if (typeof data == 'object') {
            return data;
        }

        return null;
    }
}

export default Serialization;
