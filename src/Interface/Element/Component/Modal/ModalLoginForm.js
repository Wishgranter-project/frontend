import ModalForm from './ModalForm';
import FormElent from '../Form/FormElent';

/**
 * Form to login.
 *
 * @class
 */
class ModalLoginForm extends ModalForm
{
    /**
     * @inheritdoc
     */
    static elementName = 'modal-login-form';

    /**
     * Constructor.
     *
     * @param {Api} api
     * API to communicate with the back-end.
     */
    __construct(api)
    {
        super.__construct(api);
    }

    /**
     * @inheritdoc
     */
    subRenderHeader()
    {
        super.subRenderHeader();
        this.$refs.header.innerHTML = 'Login';
    }

    /**
     * @inheritdoc
     */
    subRenderForm()
    {
        this.$refs.form = this.$refs.body.attach(FormElent.instantiate());
        this.$refs.username = this.$refs.form.addTextField('username', 'Username', '');
        this.$refs.password = this.$refs.form.addPasswordField('password', 'Password', '');
        this.$refs.form.addSubmitButton('submit', 'Submit');
    }

    subRenderModal()
    {
        super.subRenderModal();
        this.$refs.closeButton.remove();
    }

    /**
     * @inheritdoc
     */
    subRenderSubmitListener()
    {
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            this.api.user
                .login(this.$refs.username.getValue(), this.$refs.password.getValue())
                .then(this.onResponse.bind(this), this.onResponse.bind(this));
        });
    }

    /**
     * @inheritdoc
     */
    onResponse(response)
    {
        this.$refs.messages.messages(response);

        if (response.successes && response.successes.length) {
            alert('Welcome back!');
            window.location.reload();
            this.remove();
        }
    }
}

ModalLoginForm.register();

export default ModalLoginForm;
