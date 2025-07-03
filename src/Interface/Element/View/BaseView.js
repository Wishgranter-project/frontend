import CustomElement from '../CustomElement';

/**
 * @abstract
 */
class ViewElement extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'view-base';

    /**
     * Constructor.
     *
     * @param {HashRequest} hashRequest
     * The request.
     * @param {Api} api 
     * The api to communicate with the server.
     */
    __construct(hashRequest, api)
    {
        super.__construct();
        this.hashRequest = hashRequest;
        this.api = api;
    }

    afterRender()
    {
        this.classList.add('view');
    }
}

export default ViewElement;
