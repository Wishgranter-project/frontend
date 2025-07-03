import BaseView        from './BaseView';
import SearchHeader    from '../Component/SearchHeader';
import DiscographyItem from '../Component/DiscographyItem';
import Album           from '../Component/Album';
import Queue           from '../../../Line/Queue';

/**
 * Displays a grid of search results for albums.
 */
class ViewDiscoverAlbums extends BaseView
{
    /**
     * @inheritdoc
     */
    static elementName = 'view-discography';

    /**
     * @inheritdoc
     */
    async render()
    {
        this.classList.add('view-discography');

        var artist = this.hashRequest.queryParams.get('artist');
        var title  = this.hashRequest.queryParams.get('title');

        this.api.discover.albums.search(this.hashRequest.queryParams).then((response) =>
        {
            this.subRenderHeader();
            this.subRenderBody(title);
            this.subRenderDiscographyItems(response, title);
        }).then(() =>
        {
            if (!this.$refs.album) {
                return;
            }

            var a = Album.instantiate(artist, title, this.api);
            this.$refs.album.append(a);
        });
    }

    subRenderHeader()
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header view-discography__header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('h1', null, 'Discover albums');

        this.$refs.headerB.append(SearchHeader.instantiate(this.hashRequest, '', [
            {type: 'search', name: 'artist', placeholder: 'Artist', title: 'Artist', class: 'main'},
        ]));

        this.$refs.playButton = this.$refs.headerF.createAndAttach('button', {title: 'Play all'}, this.create('span', {class: 'fa fa-play'}));
        this.$refs.playButton.addEventListener('click', this.playAllAlbuns.bind(this));
    }

    subRenderBody(title)
    {
        this.$refs.body = this.createAndAttach('main', { class: 'view-discography__body flexy' });
        this.$refs.grid = this.$refs.body.createAndAttach('div', {class: 'grid view-discography__releases'});
        if (title) {
            this.$refs.album = this.$refs.body.createAndAttach('div', { class: 'view-discography__tracks' });
        }
    }

    subRenderDiscographyItems(response, title)
    {
        var cssClass = title
            ? 'col-12 col-sm-6 col-md-4 col-lg-3'
            : 'col-6 col-sm-4 col-md-3 col-lg-2';

        for (var album of response.data) {
            this.$refs.grid.createAndAttach('div', {class: cssClass}, DiscographyItem.instantiate(album));
        }
    }

    /**
     * Adds all the albums in the view to the queue.
     */
    playAllAlbuns()
    {
        var items = this.getPlayableItems();

        this.fireEvent('queue:item-selected', {
            item: items[0],
            queue: Queue.instantiate(items, null)
        });
    }

    getPlayableItems()
    {
        var items = [];

        for (var element of this.querySelectorAll(DiscographyItem.elementName)) {
            items.push({
                album: element.album.title,
                artist: element.album.artist,
            });
        }

        return items;
    }
}

ViewDiscoverAlbums.register();

export default ViewDiscoverAlbums;
