import CustomElement from '../CustomElement';

class SearchHeader extends CustomElement 
{
    static elementName = 'view-search-header';

    __construct(request, title, fields) 
    {
        this.request = request;
        this.title   = title;
        this.fields  = fields;
    }

    render() 
    {
        this.classList.add('search-header');

        // if (this.title) {
        //     this.$refs.h1 = this.createAndAttach('h1', null, this.title);
        // }

        this.$refs.form = this.createAndAttach('form', { action: '#' + this.request.path, title: this.title, class: 'input-group input-group-horizontal'});

        var input;
        for (var field of this.fields) {
            field.value = this.request.queryParams.get(field.name) || '';
            input = this.$refs.form.createAndAttach('input', field);
            if (field.value.length) {
                input.focus();
                input.selectionStart = input.selectionEnd = input.value.length;
            }
        }

        this.$refs.form.createAndAttach('button', null, [this.create('span', {class: 'fa fa-search'})]);
    }
}

SearchHeader.register();

export default SearchHeader;
