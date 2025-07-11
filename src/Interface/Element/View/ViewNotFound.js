import BaseView from './BaseView';

/**
 * Generic not found view.
 */
class ViewNotFound extends BaseView
{
    static elementName = 'not-found';

    async render()
    {
        this.createAndAttach('h1', null, 'Not found');
        this.createAndAttach('p', null, `Nothing found related to ${this.hashRequest.path}`);
    }  
    
}

ViewNotFound.register();

export default ViewNotFound;
