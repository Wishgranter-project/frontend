import CustomElement from '../CustomElement';

class Pagination extends CustomElement 
{
    static elementName = 'view-pagination';

    __construct(api, request, response) 
    {
        this.api = api;
        this.request = request;
        this.response = response;
    }

    render() 
    {
        this.classList.add('button-group');
        this.classList.add('view-nav');
        var queryParams;

        if (!this.response.meta || !this.response.meta.pages) {
            return;
        }

        if (this.response.meta.pages > 1) {
            queryParams = this.request.queryParams.without('page');
            queryParams.set('page', 1);
            this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn view-nav-first'}, ['first']);
        }

        if (this.response.meta.page > 1) {
            queryParams = this.request.queryParams.without('page');
            queryParams.set('page', this.response.meta.page - 1);
            this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn'}, ['prev']);
        }

        if (this.response.meta.pages > this.response.meta.page) {
            queryParams = this.request.queryParams.without('page');
            queryParams.set('page', this.response.meta.page + 1);
            this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn'}, ['next']);
        }

        if (this.response.meta.pages > this.response.meta.page) {
            queryParams = this.request.queryParams.without('page');
            queryParams.set('page', this.response.meta.pages);
            this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn view-nav-last'}, ['last']);
        }
    }

}

Pagination.register();

export default Pagination;
