import BaseView        from './BaseView';
import SearchHeader    from '../Component/SearchHeader';
import DiscographyItem from '../Component/DiscographyItem';

class ViewDiscoverAlbums extends BaseView
{
    static elementName = 'view-discography';

    async render() 
    {
        this.classList.add('view--albums');

        this.api.discover.albums.search(this.hashRequest.queryParams).then((response) =>
        {
            this.renderHeader(response);
            this.renderAlbums(response);
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

        this.$refs.headerB.append(SearchHeader.instantiate(this.hashRequest, '', [
            {type: 'search', name: 'artist', placeholder: 'Artist', class: 'main'},
        ]));
    }

    async renderAlbums(response) 
    {
        var grid = this.createAndAttach('div', {class: 'grid releases'});

        for (var rl of response.data) {
            grid.createAndAttach('div', {class: 'col-6 col-sm-4 col-md-3 col-lg-2'}, DiscographyItem.instantiate(rl));
        }
    }   
}

ViewDiscoverAlbums.register();

export default ViewDiscoverAlbums;
