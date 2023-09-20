import CustomElement from '../CustomElement';

class Modal extends CustomElement 
{
    static elementName = 'modal-window';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.subRenderModal();
    }

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
