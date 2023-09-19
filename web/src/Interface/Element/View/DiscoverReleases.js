import ViewElement from './ViewElement';
import SearchHeader from '../Component/SearchHeader';
import Pagination from '../Component/Pagination';

class DiscoverReleases extends ViewElement 
{
    static elementName = 'view-discography';

    async render() 
    {
        this.api.discover.releases.search(this.request.queryParams).then((response) =>
        {
            this.renderHeader(response);
            this.renderReleases(response);
            this.renderNavigation(response);
        });
    }

    renderHeader(response) 
    {
        var header = SearchHeader.instantiate(this.request, 'Discover albums', [
            {type: 'search', name: 'artist', placeholder: 'artist', class: 'main'}
        ]);
        this.append(header);
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

DiscoverReleases.register();

export default DiscoverReleases;
