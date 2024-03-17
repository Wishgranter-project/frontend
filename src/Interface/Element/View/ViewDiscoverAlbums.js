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
            this.renderDiscographyItem(response);
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

        this.$refs.playButton = this.$refs.headerF.createAndAttach('button', {title: 'Play all'}, this.create('span', {class: 'fa fa-play'}));
        this.$refs.playButton.addEventListener('click', this.playAllAlbuns.bind(this));
    }

    playAllAlbuns(evt)
    {
        var initialBatch = [];
        for (var element of this.querySelectorAll(DiscographyItem.elementName)) {
            initialBatch.push({
                album: element.album.title,
                artist: element.album.artist,
            });
        }

        this.fireEvent('queue:item-selected', {
            item: initialBatch
        });
    }

    async renderDiscographyItem(response) 
    {
        var grid = this.createAndAttach('div', {class: 'grid releases'});

        for (var album of response.data) {
            grid.createAndAttach('div', {class: 'col-6 col-sm-4 col-md-3 col-lg-2'}, DiscographyItem.instantiate(album));
        }
    }
}

ViewDiscoverAlbums.register();

export default ViewDiscoverAlbums;
