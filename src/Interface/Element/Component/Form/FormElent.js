import CustomElement     from '../../CustomElement';
import TextField         from './TextField';
import PasswordField     from './PasswordField';
import TextArea          from './TextArea';
import MultipleTextField from './MultipleTextField';

/**
 * Represents a form.
 */
class FormElent extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'form-element';

    /**
     * @inheritdoc
     */
    render()
    {
        this.$refs.form = this.createAndAttach('form', {class: 'vertical', method: 'post', enctype: 'multipart/form-data'});
    }

    /**
     * Sets the value to a field.
     *
     * @param {String} name
     * Name of the field.
     * @param {Mixed} value
     * The value
     *
     * @returns {FormElent}
     * Itself.
     */
    setValue(name, value)
    {
        if (!this.$refs[name]) {
            console.error(`No input named "${name}"`);
        }

        this.$refs[name].setValue(value);

        return this;
    }

    /**
     * Gets the form.
     *
     * @returns {FormElement}
     * The form.
     */
    getForm()
    {
        return this.$refs.form;
    }

    /**
     * Adds a hidden input to the form.
     *
     * @param {String} name
     * The name of the input.
     * @param {String|Integer} value
     * The value for the input.
     *
     * @returns {HTMLElement}
     * The new input.
     */
    addHidden(name, value)
    {
        return this.$refs[name] = this.$refs.form.createAndAttach('input', {type: 'hidden', name, value});
    }

    /**
     * Adds a text input to the form.
     *
     * @param {String} name
     * The name of the input.
     * @param {String} label
     * Human readable label.
     * @param {String|Integer} value
     * The value for the input.
     * @param {String} placeholder
     * Placeholder for the input.
     *
     * @returns {HTMLElement}
     * The new input.
     */
    addTextField(name, label, value, placeholder = '')
    {
        return this.$refs[name] = this.$refs.form.attach(TextField.instantiate(name, label, value, placeholder));
    }

    /**
     * Adds a password input to the form.
     *
     * @param {String} name
     * The name of the input.
     * @param {String} label
     * Human readable label.
     * @param {String|Integer} value
     * The value for the input.
     * @param {String} placeholder
     * Placeholder for the input.
     *
     * @returns {HTMLElement}
     * The new input.
     */
    addPasswordField(name, label, value, placeholder = '')
    {
        return this.$refs[name] = this.$refs.form.attach(PasswordField.instantiate(name, label, value, placeholder));
    }

    /**
     * Adds a text area to the form.
     *
     * @param {String} name
     * The name of the input.
     * @param {String} label
     * Human readable label.
     * @param {String|Integer} value
     * The value for the input.
     * @param {String} placeholder
     * Placeholder for the input.
     *
     * @returns {HTMLElement}
     * The new element.
     */
    addTextArea(name, label, value, placeholder = '')
    {
        return this.$refs[name] = this.$refs.form.attach(TextArea.instantiate(name, label, value, placeholder));
    }

    /**
     * Adds a multi value text element to the form.
     *
     * @param {String} name
     * The name of the input.
     * @param {String} label
     * Human readable label.
     * @param {Array} value
     * The values for the input.
     * @param {String} placeholder
     * Placeholder for the input.
     * @param {String} addButtonLabel
     * Label to the add more button.
     *
     * @returns {MultipleTextField}
     * The new element.
     */
    addMultiTextField(name, label, value, placeholder = '', addButtonLabel = 'Add +')
    {
        return this.$refs[name] = this.$refs.form.attach(MultipleTextField.instantiate(name, label, value, placeholder, addButtonLabel));
    }

    /**
     * Adds a submit button.
     *
     * @param {String} name
     * The name of the input.
     * @param {String} label
     * Human readable label.
     *
     * @returns {HTMLElement}
     * The new element.
     */
    addSubmitButton(name = 'submit', label = 'Submit')
    {
        return this.$refs[name] = this.$refs.form.createAndAttach('div', {class: 'form-group'}, [
            this.create('input', {type: 'submit', name, value: label, class: 'col-12 btn-main'})
        ]);
    }

    addSubmitAndCancel(cancelLabel = 'Cancel', submitLabel = 'Save')
    {
        this.$refs.form.createAndAttach('div', {class: 'input-group input-group-horizontal'}, [
            this.$refs.cancelButton = this.create('button', {type: 'button', class: 'btn-danger'}, ` ${cancelLabel} `),
            this.$refs.submitButton = this.create('input', {type: 'submit', name: 'save', value: submitLabel, class: 'main btn-main'}),
        ]);

        this.$refs.cancelButton.addEventListener('click', () => 
        {
            this.fireEvent('form:cancel');
        });
    }

}

FormElent.register();

export default FormElent;
