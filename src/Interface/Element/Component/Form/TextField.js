import CustomElement from '../../CustomElement';

/**
 * Text field form element.
 *
 * @class
 */
class TextField extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'text-field';

    /**
     * Constructor.
     *
     * @param {String} name
     * The name of the text area.
     * @param {String} label
     * Human readable label.
     * @param {String} value
     * The value for the text area.
     * @param {String} placeholder
     * Human readable placeholder.
     */
    __construct(name, label, value, placeholder = '')
    {
        super.__construct();
        this.name        = name;
        this.label       = label;
        this.value       = value;
        this.placeholder = placeholder;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        var id = Math.floor(Math.random() * 10000);
        this.classList.add('form-group');
        this.createAndAttach('label', {class: 'label col-sm-2', for: id}, this.label);
        this.$refs.input = this.createAndAttach('input', {type: 'text', class: 'col-sm-10', id, name: this.name, value: this.value, placeholder: this.placeholder});        
    }

    /**
     * Set the value.
     *
     * @param {String} value
     * The value for the text area.
     */
    setValue(value)
    {
        this.$refs.input.value = value;
    }
}

TextField.register();

export default TextField;
