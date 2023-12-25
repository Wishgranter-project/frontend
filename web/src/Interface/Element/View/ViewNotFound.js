import BaseView from './BaseView';

class ViewNotFound extends BaseView 
{
    static elementName = 'not-found';

    async render() 
    {
        this.createAndAttach('h1', null, 'Not found');
        this.createAndAttach('p', null, `Nothing found related to ${this.request.path}`);
    }  
    
}

ViewNotFound.register();

export default ViewNotFound;
