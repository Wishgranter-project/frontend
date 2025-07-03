import CustomElement from '../CustomElement';

/**
 * A minimal form to conduct searches.
 *
 * Designed to be added to the header of views.
 */
class SearchHeader extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'view-search-header';

    /**
     * Constructor.
     *
     * @param {HashRequest} request
     * The request object.
     * @param {String} title
     * The title for the form.
     * @param {Object} fields
     * Definition of the form's fields.
     */
    __construct(request, title, fields)
    {
        super.__construct();
        this.request = request;
        this.title   = title;
        this.fields  = fields;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('search-header');

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
