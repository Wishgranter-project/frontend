import CustomElement from '../CustomElement';

class Pagination extends CustomElement 
{
    static elementName = 'view-pagination';

    __construct(api, request, response) 
    {
        this.api = api;
        this.request = request;
        this.response = response;

        if (!this.response.meta || !this.response.meta.pages) {
            return;
        }

        this.max = 10;
        this.halfMax = this.max / 2;

        if (this.response.meta.pages <= this.max) {
            this.first = 1;
            this.last = this.response.meta.pages;

        } else if (this.response.meta.page + this.halfMax > this.response.meta.pages) {
            this.last = this.response.meta.pages;
            this.first = this.last - this.max;
    
        } else if (this.response.meta.page > this.halfMax) {
            this.first = this.response.meta.page - this.halfMax;
            this.last  = this.response.meta.page + this.halfMax;
    
        } else {
            this.first = 1;
            this.last = this.first + this.max;
        }

        this.between = this.last - this.first + 1;
    }

    render() 
    {
        this.classList.add('button-group');
        this.classList.add('view-nav');

        if (!this.response.meta || !this.response.meta.pages) {
            return;
        }

        this.subRenderAnchorToBeginning();
        this.subRenderAnchorToPreviousPage();
        this.subRenderAnchorBetweenExtremes();
        this.subRenderAnchorToNextPage();
        this.subRenderAnchorToLast();
    }

    subRenderAnchorToBeginning() 
    {
        if (this.first == 1) {
            return;
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', 1);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': 1, class: 'btn view-nav-first', title: this.request.meta.title}, ['first']);
    }

    subRenderAnchorToPreviousPage() 
    {
        if (this.response.meta.page == 1 || this.between <= 3) {
            return;
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.response.meta.page - 1);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': (this.response.meta.page - 1), class: 'btn view-nav-previous', title: this.request.meta.title}, ['prev']);
    }

    subRenderAnchorBetweenExtremes() 
    {
        if (this.response.meta.pages <= 1) {
            return;
        }

        for (var p = this.first; p <= this.last; p++) {
            var queryParams = this.request.queryParams.without('page');
            queryParams.set('page', p);
            var current = this.response.meta.page == p;
            this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': p, class: current ? 'btn view-nav-current' : 'btn', title: this.request.meta.title}, [p]);
        }
    }

    subRenderAnchorToNextPage()
    {
        if (this.response.meta.page == this.response.meta.pages || this.between <= 3) {
            return;
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.response.meta.page + 1);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': (this.response.meta.page + 1), class: 'btn view-nav-next', title: this.request.meta.title}, ['next']);
    }

    subRenderAnchorToLast() 
    {
        if (this.last == this.response.meta.pages) {
            return
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.response.meta.pages);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': this.response.meta.pages, class: 'btn view-nav-last', title: this.request.meta.title}, ['last']);
    }
}

Pagination.register();

export default Pagination;
