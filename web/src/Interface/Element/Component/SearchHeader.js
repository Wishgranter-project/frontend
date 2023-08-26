import CustomElement from '../CustomElement';
import CastDown from 'http/src/CastDown';
import Convert from 'http/src/Convert';

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
        this.createAndAttach('h1', null, this.title);
        this.$refs.form = this.createAndAttach('form', {class: 'search-header__form input-group'});

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
        this.$refs.form.addEventListener('submit', (evt) => 
        {
            evt.preventDefault();
            window.location.href = this.request.path + '?' + Convert.objectToSearchParams(CastDown.toObject(this.$refs.form)).toString();
        });
    }

}

SearchHeader.register();

export default SearchHeader;
