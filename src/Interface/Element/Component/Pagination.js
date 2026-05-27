import CustomElement from '../CustomElement';

/**
 * Item to paginate results.
 *
 * @class
 */
class Pagination extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'view-pagination';

    /**
     * Constructor.
     *
     * @param {HashRequest} request
     * The request object.
     * @param {Object} response
     * The response from the back-end.
     */
    __construct(request, response)
    {
        super.__construct();
        this.request = request;
        this.response = response;

        if (!this.response.meta || !this.response.meta.pagesCount) {
            return;
        }

        this.max = 10;
        this.halfMax = this.max / 2;

        if (this.pagesCount <= this.max) {
            this.first = 1;
            this.last = this.pagesCount;

        } else if (this.currentPage + this.halfMax > this.pagesCount) {
            this.last = this.pagesCount;
            this.first = this.last - this.max;
    
        } else if (this.currentPage > this.halfMax) {
            this.first = this.currentPage - this.halfMax;
            this.last  = this.currentPage + this.halfMax;
    
        } else {
            this.first = 1;
            this.last = this.first + this.max;
        }

        this.between = this.last - this.first + 1;
    }

    get currentPage()
    {
        return this.response.meta.currentPage;
    }

    get pagesCount()
    {
        return this.response.meta.pagesCount;
    }

    get onlyOnePage()
    {
        return this.pages == 1;
    }

    get inTheLastPage()
    {
        return this.currentPage == this.pages;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('button-group');
        this.classList.add('view-nav');

        if (!this.response.meta || !this.pagesCount) {
            return;
        }

        this.subRenderAnchorToBeginning();
        this.subRenderAnchorToPreviousPage();
        this.subRenderAnchorBetweenExtremes();
        this.subRenderAnchorToNextPage();
        this.subRenderAnchorToLast();
    }

    /**
     * Renders the button to return to the beginning.
     */
    subRenderAnchorToBeginning()
    {
        if (this.first == 1) {
            return;
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', 1);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': 1, class: 'btn view-nav-first', title: this.request.meta.title}, ['first']);
    }

    /**
     * Renders the button to return to the previous page.
     */
    subRenderAnchorToPreviousPage()
    {
        if (this.currentPage == 1 || this.between <= 3) {
            return;
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.currentPage - 1);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': (this.currentPage - 1), class: 'btn view-nav-previous', title: this.request.meta.title}, ['prev']);
    }

    /**
     * Renders the buttons between extremes.
     */
    subRenderAnchorBetweenExtremes()
    {
        if (this.pagesCount <= 1) {
            return;
        }

        for (var p = this.first; p <= this.last; p++) {
            var queryParams = this.request.queryParams.without('page');
            queryParams.set('page', p);
            var current = this.currentPage == p;
            this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': p, class: current ? 'btn view-nav-current' : 'btn', title: this.request.meta.title}, [p]);
        }
    }

    /**
     * Renders the button to move to the next page.
     */
    subRenderAnchorToNextPage()
    {
        if (this.currentPage == this.pagesCount || this.between <= 3) {
            return;
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.currentPage + 1);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': (this.currentPage + 1), class: 'btn view-nav-next', title: this.request.meta.title}, ['next']);
    }

    /**
     * Renders the button to go to the last page.
     */
    subRenderAnchorToLast()
    {
        if (this.last == this.pagesCount) {
            return
        }

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', this.pagesCount);
        this.createAndAttach('a', {href: this.request.path.replace('/', '#') + '?' + queryParams.toString(), 'data-page': this.pagesCount, class: 'btn view-nav-last', title: this.request.meta.title}, ['last']);
    }
}

Pagination.register();

export default Pagination;
