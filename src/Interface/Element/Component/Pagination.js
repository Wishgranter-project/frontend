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

    /**
     * Returns the current page.
     *
     * @returns {Integer}
     * The page.
     */
    get currentPage()
    {
        return this.response.meta.currentPage;
    }

    /**
     * Returns how many pages are there.
     *
     * @returns {Integer}
     * The number of pages.
     */
    get pagesCount()
    {
        return this.response.meta.pagesCount;
    }

    /**
     * Check if there is a single page.
     *
     * @returns {Boolean}
     * True if there is a single page.
     */
    get onlyOnePage()
    {
        return this.pages == 1;
    }

    /**
     * Check if we are at the last page.
     *
     * @returns {Boolean}
     * True if we are at the last page.
     */
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

        this.addAnchor(1, 'first', 'btn view-nav-first');
    }

    /**
     * Renders the button to return to the previous page.
     */
    subRenderAnchorToPreviousPage()
    {
        if (this.currentPage == 1 || this.between <= 3) {
            return;
        }

        this.addAnchor(this.currentPage - 1, 'prev', 'btn view-nav-previous');
    }

    /**
     * Renders the buttons between extremes.
     */
    subRenderAnchorBetweenExtremes()
    {
        if (this.pagesCount <= 1) {
            return;
        }

        var current = false;
        for (var p = this.first; p <= this.last; p++) {
            current = this.currentPage == p;
            this.addAnchor(p, p, (current ? 'btn view-nav-current' : 'btn'));
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

        this.addAnchor(this.currentPage + 1, 'next', 'btn view-nav-next');
    }

    /**
     * Renders the button to go to the last page.
     */
    subRenderAnchorToLast()
    {
        if (this.last == this.pagesCount) {
            return
        }

        this.addAnchor(this.pagesCount, 'last', 'btn view-nav-last');
    }

    /**
     * Adds a new anchor to the pagination.
     *
     * @protected
     *
     * @param {Integer} pageNumber
     * Page number the anchor aims for.
     * @param {String} label
     * Human readable string.
     * @param {String|null} className
     * Css class name.
     * @param {String|null} title
     * Tittle attribute.
     *
     * @returns {HTMLElement}
     * The anchor element.
     */
    addAnchor(pageNumber, label, className = null, title = null)
    {
        title = title || this.request.meta.title;
        className = className || 'btn';

        var queryParams = this.request.queryParams.without('page');
        queryParams.set('page', pageNumber);

        return this.createAndAttach(
            'a', 
            {
                href: this.request.path.replace('/', '#') + '?' + queryParams.toString(),
                'data-page': pageNumber,
                class: className,
                title
            }, 
            [ label ]
        );
    }
}

Pagination.register();

export default Pagination;
