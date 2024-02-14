import BaseView from './BaseView';
import SearchHeader from '../Component/SearchHeader';
import MusicAlbum from '../Component/MusicAlbum';

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
            grid.createAndAttach('div', {class: 'col-6 col-sm-4 col-md-3 col-lg-2'}, MusicAlbum.instantiate(rl));
        }
    }   
}

ViewDiscoverReleases.register();

export default ViewDiscoverReleases;
