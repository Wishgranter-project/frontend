import ViewElement from './ViewElement';

class NotFound extends ViewElement 
{
    static elementName = 'not-found';

    async render() 
    {
        this.createAndAttach('h1', null, 'Not found');
        this.createAndAttach('p', null, `Nothing found related to ${this.request.path}`);
    }  
    
}

NotFound.register();

export default NotFound;
