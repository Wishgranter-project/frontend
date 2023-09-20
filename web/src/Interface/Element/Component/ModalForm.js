import Modal from './Modal';

import Messages from './Messages';
import FormElent from './Form/FormElent';

class ModalForm extends Modal 
{
    static elementName = 'modal-form';

    __construct() 
    {
        
    }

    render() 
    {
        super.subRenderModal();
        this.subRenderHeader();
        this.subRenderForm();
        this.subRenderSubmitListener();
    }

    subRenderHeader() 
    {
        this.$refs.messages = this.$refs.body.attach(Messages.instantiate());
    }

    subRenderForm() 
    {
        this.$refs.form = this.$refs.body.attach(FormElent.instantiate());
        this.$refs.form.addTextField('title', 'Title', '');
        this.$refs.form.addSubmitButton('save', 'Save');
    }

    subRenderSubmitListener() 
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            console.log('FORM SUBMITTED');
        });
    }

    onResponse(response) 
    {
        this.$refs.messages.messages(response);

        if (response.successes && response.successes.length) {
            alert('FINISHED!');
            this.remove();
        }
    }
}

ModalForm.register();

export default ModalForm;
