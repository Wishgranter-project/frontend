import CustomElement from '../../CustomElement';

/**
 * A modal window.
 *
 * @class
 * @abstract
 */
class Modal extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-window';

    /**
     * Constructor.
     */
    __construct()
    {
        super.__construct();
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('modal');
        this.createAndAttach('div', {class: 'modal-dialog'}, [
            this.create('div', {class: 'modal-content'}, [
                this.$refs.header = this.create('div', {class: 'modal-header'}),
                this.$refs.body   = this.create('div', {class: 'modal-body'}),
                this.$refs.footer = this.create('div', {class: 'modal-footer'})
            ])
        ]);

        this.subRenderModalHead();
        this.subRenderModalBody();
        this.subRenderModalFooter();
        this.subRenderModalTidyUp();
    }

    /**
     * Renders the modal's head.
     */
    subRenderModalHead()
    {

    }

    /**
     * Renders the modal's body.
     */
    subRenderModalBody()
    {
        
    }

    /**
     * Renders the modal's footer.
     */
    subRenderModalFooter()
    {
        this.$refs.closeButton = this.create('button', {class: 'btn-danger'}, 'Cancel').attachTo(this.$refs.footer);
        this.$refs.closeButton.addEventListener('click', () => 
        {
            this.remove();
        });
    }

    /**
     * Remove empty elements.
     *
     * @protected
     */
    subRenderModalTidyUp()
    {
        if (!this.$refs.header.childNodes.length) {
            this.$refs.header.remove();
        }

        if (!this.$refs.footer.childNodes.length) {
            this.$refs.footer.remove();
        }
    }
}

Modal.register();

export default Modal;
