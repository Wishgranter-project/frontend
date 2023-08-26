import ViewElement from './ViewElement';
import SearchHeader from '../Component/SearchHeader';

class DiscoverArtists extends ViewElement 
{
    static elementName = 'view-discover';

    async render() 
    {
        this.fetch().then((response) =>
        {
            this.renderHeader(response);
            this.renderArtists(response);
        });
    }

    fetch() 
    {
        return this.request.queryParams.isEmpty()
            ? new Promise((r,f) => {return r({data: []});})
            : this.api.discover.artists.search(this.request.queryParams)
    }

    renderHeader(response) 
    {
        var header = SearchHeader.instantiate(this.request, 'Discover artist', [
            {type: 'search', name: 'name', placeholder: 'name', class: 'main'}
        ]);
        this.append(header);
    }

    async renderArtists(response) 
    {
        var grid = this.createAndAttach('div', {class: 'grid artists'});

        for (var ar of response.data) {
            grid.createAndAttach('a', {href: `#discover:releases?artist=${ar.name}`, class: 'col-6 col-sm-4 col-md-3 col-lg-2'}, [
                this.create('span', {class: 'card'}, [
                    (ar.thumb ? this.create('img', {src: ar.thumb}) : null),
                    this.create('h4', null, [ar.name])
                ])
            ]);
        }
    }
    
}

DiscoverArtists.register();

export default DiscoverArtists;
