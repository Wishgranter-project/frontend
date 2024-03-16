import BaseView     from './BaseView';
import SearchHeader from '../Component/SearchHeader';

class ViewDiscoverArtists extends BaseView 
{
    static elementName = 'view-discover';

    async render() 
    {
        this.classList.add('view--artists');
        this.fetch().then((response) =>
        {
            this.renderHeader(response);
            this.renderArtists(response);
        });
    }

    fetch() 
    {
        return this.hashRequest.queryParams.isEmpty()
            ? new Promise((r,f) => {return r({data: []});})
            : this.api.discover.artists.search(this.hashRequest.queryParams)
    }

    renderHeader(response) 
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('h1', null, 'Discover artist');

        this.$refs.headerB.append(SearchHeader.instantiate(this.hashRequest, 'Discover artist', [
            {type: 'search', name: 'name', placeholder: 'Name', class: 'main'},
        ]));
    }

    async renderArtists(response) 
    {
        var grid = this.createAndAttach('div', {class: 'grid artists'});

        for (var ar of response.data) {
            grid.createAndAttach('a', {href: `#discover:albums?artist=${ar.name}`, title: ar.name, class: 'col-6 col-sm-4 col-md-3 col-lg-2'}, [
                this.create('span', {class: 'card'}, [
                    (ar.thumbnail ? this.create('img', {src: ar.thumbnail}) : null),
                    this.create('h4', null, [ar.name])
                ])
            ]);
        }
    }
    
}

ViewDiscoverArtists.register();

export default ViewDiscoverArtists;
