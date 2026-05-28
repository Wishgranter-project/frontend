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
     * {@inheritdoc}
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
     * {@inheritdoc}
     */
    render()
    {
        this.subRenderModal();
    }

    /**
     * Renders the structure of the modal window.
     */
    subRenderModal()
    {
        this.classList.add('modal');
        this.createAndAttach('div', {class: 'modal-dialog'}, [
            this.create('div', {class: 'modal-content'}, [
                this.$refs.header = this.create('div', {class: 'modal-header'}, ['header']),
                this.$refs.body   = this.create('div', {class: 'modal-body'}),
                this.$refs.footer = this.create('div', {class: 'modal-footer'}, [
                    this.$refs.closeButton = this.create('button', {class: 'btn-danger'}, 'Close')
                ])
            ])
        ]);

        this.$refs.closeButton.addEventListener('click', () => 
        {
            this.remove();
        })
    }

}

Modal.register();

export default Modal;
