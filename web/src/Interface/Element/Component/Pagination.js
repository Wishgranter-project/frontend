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
    }

    render() 
    {
        this.classList.add('button-group');
        this.classList.add('view-nav');

        if (!this.response.meta || !this.response.meta.pages) {
            return;
        }

        if (this.first > 1) {
            this.subRenderAnchorToBeginning();
        }

        if (this.response.meta.page > 1) {
            this.subRenderAnchorToPreviousPage();
        }

        if (this.response.meta.pages > this.max) {
            this.subRenderAnchorBetweenExtremes();
        }

        if (this.response.meta.page < this.last) {
            this.subRenderAnchorToNextPage();
        }
        
        if (this.response.meta.pages > this.last) {
            this.subRenderAnchorToLast();
        }
    }

    subRenderAnchorToBeginning() 
    {
        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', 1);
        this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn view-nav-first'}, ['first']);
    }

    subRenderAnchorToPreviousPage() 
    {
        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.response.meta.page - 1);
        this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn view-nav-previous'}, ['prev']);
    }

    subRenderAnchorBetweenExtremes() 
    {
        for (var p = this.first; p <= this.last; p++) {
            var queryParams = this.request.queryParams.without('page');
            queryParams.set('page', p);
            var current = this.response.meta.page == p;
            this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: current ? 'btn view-nav-current' : 'btn'}, [p]);
        }
    }

    subRenderAnchorToNextPage()
    {
        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.response.meta.page + 1);
        this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn view-nav-next'}, ['next']);
    }

    subRenderAnchorToLast() 
    {
        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.response.meta.pages);
        this.createAndAttach('a', {href: this.request.path + '?' + queryParams.toString(), class: 'btn view-nav-last'}, ['last']);
    }
}

Pagination.register();

export default Pagination;
