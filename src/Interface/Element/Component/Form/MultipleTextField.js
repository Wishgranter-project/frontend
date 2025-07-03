import CustomElement from '../../CustomElement';

/**
 * Multi text form element.
 *
 * @class
 */
class MultipleTextField extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'multiple-text-field';

    /**
     * Constructor.
     *
     * @param {String} name
     * The name of the element.
     * @param {*} label
     * Human readable label.
     * @param {String|Integer|Array} value
     * Value(s) for the element.
     * @param {*} placeholder
     * Placeholder for the element.
     * @param {*} addButtonLabel
     * Label to the add more button.
     */
    __construct(name, label, value, placeholder = '', addButtonLabel = 'Add +')
    {
        super.__construct();
        this.name           = name;
        this.label          = label;
        this.value          = value;
        this.placeholder    = placeholder;
        this.addButtonLabel = addButtonLabel;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('form-group');
        this.createAndAttach('span', {class: 'label col-sm-2'}, this.label);
        this.createAndAttach('div', {class: 'col-sm-10'}, [
            this.$refs.body = this.create('div', {class: 'input-group input-group-vertical'}),
            this.$refs.plusButton = this.create('small', {}, this.addButtonLabel)
        ]);

        this.$refs.plusButton.addEventListener('click', this.addBlank.bind(this));
        this.setValue(this.value);
    }

    /**
     * Sets the value(s) to the element.
     *
     * @param {String|Array} value 
     * The value(s).
     */
    setValue(value)
    {
        this.$refs.body.clear();
        this.addValues(value);
    }

    /**
     * Adds value(s) to the element.
     *
     * @param {String|Array} value 
     * The value(s).
     */
    addValues(value)
    {
        value = Array.isArray(value) ? value : [value];
        for (var v of value) {
            this.add(v);
        }
    }

    /**
     * Adds a value to the element.
     *
     * @param {String|Integer} value
     * The value.
     */
    add(value = '')
    {
        this.$refs.body.createAndAttach('input', {type: 'text', placeholder: this.placeholder, class: 'col-sm-12', name: this.name, value: value});
    }

    /**
     * Adds a blank value.
     */
    addBlank()
    {
        this.add('');
    }
}

MultipleTextField.register();

export default MultipleTextField;
