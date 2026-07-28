import TextField from './TextField';

/**
 * Password field form element.
 *
 * @class
 */
class PasswordField extends TextField
{
    /**
     * @inheritdoc
     */
    static elementName = 'password-field';

    /**
     * @inheritdoc
     */
    render()
    {
        super.render();
        this.$refs.input.type = 'password';
    }
}

PasswordField.register();

export default PasswordField;
