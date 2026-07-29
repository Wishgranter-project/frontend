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

        this.subRenderHead();
        this.subRenderBody();
        this.subRenderFooter();
        this.subRenderTidyUp();
    }

    /**
     * Renders the modal's head.
     */
    subRenderHead()
    {
    }

    /**
     * Renders the modal's body.
     */
    subRenderBody()
    {
    }

    /**
     * Renders the modal's footer.
     */
    subRenderFooter()
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
    subRenderTidyUp()
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
