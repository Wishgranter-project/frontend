import CustomElement from '../../CustomElement';

class TextField extends CustomElement 
{
    static elementName = 'text-field';

    __construct(name, label, value, placeholder = '') 
    {
        this.name        = name;
        this.label       = label;
        this.value       = value;
        this.placeholder = placeholder;
    }

    render() 
    {
        var id = Math.floor(Math.random() * 10000);
        this.classList.add('form-group');
        this.createAndAttach('label', {class: 'label col-sm-2', for: id}, this.label);
        this.$refs.input = this.createAndAttach('input', {type: 'text', class: 'col-sm-10', id, name: this.name, value: this.value, placeholder: this.placeholder});        
    }

    setValue(value) 
    {
        this.$refs.input.value = value;
    }
}

TextField.register();

export default TextField;