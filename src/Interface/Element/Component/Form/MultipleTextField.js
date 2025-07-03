import CustomElement from '../../CustomElement';

class MultipleTextField extends CustomElement 
{
    static elementName = 'multiple-text-field';

    __construct(name, label, value, placeholder = '', addButton = 'Add +') 
    {
        super.__construct();
        this.name        = name;
        this.label       = label;
        this.value       = value;
        this.placeholder = placeholder;
        this.addButton   = addButton;
    }

    render() 
    {
        this.classList.add('form-group');
        this.createAndAttach('span', {class: 'label col-sm-2'}, this.label);
        this.createAndAttach('div', {class: 'col-sm-10'}, [
            this.$refs.body = this.create('div', {class: 'input-group input-group-vertical'}),
            this.$refs.plusButton = this.create('small', {}, this.addButton)
        ]);

        this.$refs.plusButton.addEventListener('click', this.addBlank.bind(this));
        this.setValue(this.value);
    }

    setValue(value) 
    {
        this.$refs.body.clear();
        this.addValues(value);
    }

    addValues(value) 
    {
        value = Array.isArray(value) ? value : [value];
        for (var v of value) {
            this.add(v);
        }
    }

    add(value = '') 
    {
        this.$refs.body.createAndAttach('input', {type: 'text', placeholder: this.placeholder, class: 'col-sm-12', name: this.name, value: value});
    }

    addBlank() 
    {
        this.add('');
    }
}

MultipleTextField.register();

export default MultipleTextField;