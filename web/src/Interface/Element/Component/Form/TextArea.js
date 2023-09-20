import CustomElement from '../../CustomElement';

class TextArea extends CustomElement 
{
    static elementName = 'text-area-field';

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
        this.$refs.input = this.createAndAttach('textarea', {class: 'col-sm-10', id, name: this.name, placeholder: this.placeholder});
        this.$refs.input.value = this.value;
    }

    setValue(value) 
    {
        this.$refs.input.value = value;
    }
}

TextArea.register();

export default TextArea;