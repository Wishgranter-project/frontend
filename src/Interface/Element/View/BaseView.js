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
     * @param {Collection} collection
     * The user's collection.
     */
    __construct(hashRequest, collection)
    {
        super.__construct();
        this.hashRequest = hashRequest;
        this.collection = collection;
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
