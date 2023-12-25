import BaseView from './BaseView';
import SearchHeader from '../Component/SearchHeader';
import Pagination from '../Component/Pagination';

class ViewDiscoverReleases extends BaseView 
{
    static elementName = 'view-discography';

    async render() 
    {
        this.classList.add('view--releases');

        this.api.discover.releases.search(this.request.queryParams).then((response) =>
        {
            this.renderHeader(response);
            this.renderReleases(response);
            this.renderNavigation(response);
        });
    }

    renderHeader(response) 
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('h1', null, 'Discover albums');

        this.$refs.headerB.append(SearchHeader.instantiate(this.request, '', [
            {type: 'search', name: 'artist', placeholder: 'Artist', class: 'main'},
        ]));
    }

    async renderReleases(response) 
    {
        var grid = this.createAndAttach('div', {class: 'grid releases'});

        for (var rl of response.data) {
            grid.createAndAttach('a', {href: `#discover:release:${rl.id}`, class: 'col-6 col-sm-4 col-md-3 col-lg-2'}, [
                this.create('span', {class: 'card'}, [
                    this.create('img', {src: rl.thumbnail || 'dist/img/missing-cover-art.webp' }),
                    this.create('h4', null, [rl.title])
                ])
            ]);
        }
    }

    renderNavigation(response) 
    {
        this.append(Pagination.instantiate(this.api, this.request, response));
    }    
}

ViewDiscoverReleases.register();

export default ViewDiscoverReleases;
