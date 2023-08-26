import CustomElement from '../../CustomElement';
import TextField from './TextField';
import MultipleTextField from './MultipleTextField';

class FormElent extends CustomElement 
{
    static elementName = 'form-element';

    render() 
    {
        this.$refs.form = this.createAndAttach('form', {class: 'horizontal', method: 'post', enctype: 'multipart/form-data'});
    }

    getForm() 
    {
        return this.$refs.form;
    }

    addHidden(name, value) 
    {
        return this.$refs[name] = this.$refs.form.createAndAttach('input', {type: 'hidden', name, value});
    }

    addTextField(name, label, value, placeholder = '') 
    {
        return this.$refs[name] = this.$refs.form.attach(TextField.instantiate(name, label, value, placeholder));
    }

    addMultiTextField(name, label, value, placeholder = '', addButton = 'Add +') 
    {
        return this.$refs[name] = this.$refs.form.attach(MultipleTextField.instantiate(name, label, value, placeholder, addButton));
    }

    addSubmitButton(name, label) 
    {
        return this.$refs[name] = this.$refs.form.createAndAttach('div', {class: 'form-group'}, [
            this.create('input', {type: 'submit', name, value: label, class: 'col-12 btn-main'})
        ]);
    }
    
}

FormElent.register();

export default FormElent;