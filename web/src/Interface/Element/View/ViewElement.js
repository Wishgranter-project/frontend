import CustomElement from '../CustomElement';

class ViewElement extends CustomElement 
{
    static elementName = 'view-welcome';

    /**
     * @param Request request 
     * @param Api api 
     */
    __construct(request, api) 
    {
        this.request = request;
        this.api = api;
    }

    afterRender() 
    {
        this.classList.add('view');
    }
}

export default ViewElement;
