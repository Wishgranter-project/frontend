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

        // if (this.title) {
        //     this.$refs.h1 = this.createAndAttach('h1', null, this.title);
        // }

        this.$refs.form = this.createAndAttach('form', {class: 'input-group input-group-horizontal'});

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
        this.$refs.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    onSubmit(evt) 
    {
        evt.preventDefault();

        /**
         * TODO: replace this error of a code for something decent.
         */
        var href = this.request.path.replace('/', '#') + '?' + Convert.objectToSearchParams(CastDown.toObject(this.$refs.form)).toString();
        var a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('title', this.title);
        a.style.display = 'none';
        this.append(a);
        a.click();
        a.remove();
    }

}

SearchHeader.register();

export default SearchHeader;
