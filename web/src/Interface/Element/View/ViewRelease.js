import BaseView from './BaseView';
import PlaylistItem from '../Component/PlaylistItem';
import QueueContextRelease from '../../../Queue/QueueContextRelease';
import Queue from '../../../Queue/Queue';

class ViewRelease extends BaseView 
{
    static elementName = 'view-release';

    async render() 
    {
        this.classList.add('view--release');

        this.api.discover.releases.getAlbum(this.request.queryParams.get('artist'), this.request.queryParams.get('title')).then((response) =>
        {
            this.subRenderHeader(response);
            this.renderTracks(response);
        });

        this.addEventListener('item-selected', this.onItemSelected.bind(this));
        this.classList.add('release-view');
    }

    subRenderHeader(response) 
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('img', {src: response.data.thumbnail || 'dist/img/missing-cover-art.webp' });

        this.$refs.headerB.createAndAttach('h1', null, response.data.title);
        this.$refs.headerB.createAndAttach('h3', null, this.create('a', { href: '#discover:releases?artist=' + response.data.artist }, response.data.artist));

        this.$refs.buttons = this.$refs.headerF.createAndAttach('div', { class: 'button-group' }, 
            this.$refs.addButton = this.create('button', { title: 'Add new item to playlist' }, this.create('span', { class: 'fa fa-plus' }))
        );

        this.$refs.addButton.addEventListener('click', this.addEntireRelease.bind(this));
    }

    addEntireRelease() 
    {
        var items = [];

        this.querySelectorAll(PlaylistItem.elementName).forEach((el) => 
        {
            items.push(el.item);
        });

        this.fireEvent('item-to-add', { items });
    }

    async renderTracks(response) 
    {
        if (!response.data.tracks) {
            return;
        }

        this.$refs.playlist = this.createAndAttach('div', { class: 'playlist' });

        for (var t of response.data.tracks) {
            this.$refs.playlist.append(PlaylistItem.instantiate({ title: t, artist: response.data.artist, album: response.data.title }))
        }
    }

    onItemSelected(evt) 
    {
        var initialBatch = [];
        for (var item of this.querySelectorAll(PlaylistItem.elementName)) {
            initialBatch.push(item.item);
        }

        for (var key in initialBatch) {
            if (initialBatch[key] == evt.detail.item) {
                initialBatch = initialBatch.slice(key);
                break;
            }
        }

        var context = new QueueContextRelease(
            this.api
        );

        var queue = Queue.instantiate(initialBatch, context);
        evt.detail.queue = queue;
    }
}

ViewRelease.register();

export default ViewRelease;
