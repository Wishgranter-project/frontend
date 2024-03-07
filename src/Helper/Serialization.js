import {HashRequest} from 'tabbed-router';

class Serialization 
{
    static serialize(arbitraryData)
    {
        return typeof arbitraryData.serialize == 'function'
            ? arbitraryData.serialize()
            : Serialization.serializeWhateverThisIs(arbitraryData);
    }

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
