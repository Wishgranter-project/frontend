import CustomElement from '../../CustomElement';

class TextArea extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'text-area-field';

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
        this.$refs.input = this.createAndAttach('textarea', {class: 'col-sm-10', id, name: this.name, placeholder: this.placeholder});
        this.$refs.input.value = this.value;
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

TextArea.register();

export default TextArea;
