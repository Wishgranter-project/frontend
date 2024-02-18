import CustomElement from '../CustomElement';

/**
 * @abstract
 */
class ViewElement extends CustomElement 
{
    static elementName = 'view-base';

    /**
     * @param HashRequest hashRequest 
     * @param Api api 
     */
    __construct(hashRequest, api) 
    {
        this.hashRequest = hashRequest;
        this.api = api;
    }

    afterRender() 
    {
        this.classList.add('view');
    }
}

export default ViewElement;
