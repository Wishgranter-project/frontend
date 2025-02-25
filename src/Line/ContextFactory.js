import ContextPlaylist from './ContextPlaylist';
import ContextSearch   from './ContextSearch';
import Instantiator    from '../Helper/Instantiator';

class ContextFactory 
{
    /**
     * Constructor.
     *
     * @param {Api} api
     * To interface with the back-end.
     */
    constructor(api)
    {
        this.api = api;
    }

    /**
     * Instantiates a queue context.
     *
     * @param {Object} dependencies
     * The context's dependencies.
     *
     * @returns {null|ContextBase}
     * The instantiated context.
     */
    instantiate(dependencies)
    {
        if (dependencies == null) {
            return null;
        }

        dependencies.api = this.api;
        var classe = null;

        switch (dependencies.id) {
            case ContextPlaylist.id():
                classe = ContextPlaylist;
            break;
            case ContextSearch.id():
                classe = ContextSearch;
            break;
        }

        if (!classe) {
            return null;
        }

        var inst = new Instantiator(classe, dependencies);
        var context = inst.instantiate();
        return context;
    }
}

export default ContextFactory;
