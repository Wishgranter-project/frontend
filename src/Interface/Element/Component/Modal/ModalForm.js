import Modal     from './Modal';
import Messages  from '../Messages';
import FormElent from '../Form/FormElent';

/**
 * A form inside a modal window.
 *
 * @class
 * @abstract
 */
class ModalForm extends Modal
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-form';

    /**
     * @inheritdoc
     */
    render()
    {
        super.subRenderModal();
        this.subRenderHeader();
        this.subRenderForm();
        this.subRenderSubmitListener();
    }

    /**
     * Renders the header.
     *
     * @protected
     */
    subRenderHeader()
    {
        this.$refs.messages = this.$refs.body.attach(Messages.instantiate());
    }

    /**
     * Renders the form.
     *
     * @protected
     */
    subRenderForm()
    {
        this.$refs.form = this.$refs.body.attach(FormElent.instantiate());
        this.$refs.form.addTextField('title', 'Title', '');
        this.$refs.form.addSubmitButton('save', 'Save');
    }

    /**
     * Adds an event listener to the form.
     *
     * @protected
     *
     * Exists only to be overridden by child classes.
     */
    subRenderSubmitListener()
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            console.log('FORM SUBMITTED');
        });
    }

    /**
     * Called after the response from the back-end.
     *
     * @param {Object} response
     * Response from the back-end.
     */
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
