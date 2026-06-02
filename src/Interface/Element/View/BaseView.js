import CustomElement from '../CustomElement';

/**
 * @abstract
 */
class ViewElement extends CustomElement
{
    /**
     * {@inheritdoc}
     */
    static elementName = 'view-base';

    /**
     * Constructor.
     *
     * @param {HashRequest} hashRequest
     * The request.
     * @param {Collection} api
     * The user's api.
     */
    __construct(hashRequest, api)
    {
        super.__construct();
        this.hashRequest = hashRequest;
        this.api = api;
    }

    /**
     * {@inheritdoc}
     */
    afterRender()
    {
        this.classList.add('view');
    }
}

export default ViewElement;
