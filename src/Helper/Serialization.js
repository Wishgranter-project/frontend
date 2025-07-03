import {HashRequest} from 'tabbed-router';

/**
 * Helper class to serialize things.
 */
class Serialization
{
    /**
     * Serializes data.
     *
     * @param {*} arbitraryData
     * Arbitrary data.
     *
     * @returns {object}
     * Flat representation.
     */
    static serialize(arbitraryData)
    {
        // Checks if the data already has a serialize() method.
        // Otherwises uses serializeWhateverThisIs().
        return typeof arbitraryData.serialize == 'function'
            ? arbitraryData.serialize()
            : Serialization.serializeWhateverThisIs(arbitraryData);
    }

    /**
     * Fallback.
     *
     * @protected
     * 
     * @param {*} arbitraryData
     * Arbitrary data.
     *
     * @returns {object}
     * Flat representation.
     */
    static serializeWhateverThisIs(arbitraryData)
    {
        switch(arbitraryData.constructor.name) {
            case HashRequest.name:
                return {
                    path:         arbitraryData.path,
                    queryParams: (arbitraryData.queryParams ? arbitraryData.queryParams.toString() : ''),
                    attributes:   arbitraryData.attributes,
                    meta:         arbitraryData.meta
                }
        }

        if (typeof arbitraryData == 'object') {
            return arbitraryData;
        }

        return null;
    }
}

export default Serialization;
