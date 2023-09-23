import ViewElement from './ViewElement';
import PlaylistItem from '../Component/PlaylistItem';
import QueueContextRelease from '../../../Queue/QueueContextRelease';
import Queue from '../../../Queue/Queue';

class Release extends ViewElement 
{
    static elementName = 'view-release';

    async render() 
    {
        this.api.discover.releases.get(this.request.attributes.releaseId).getTracks().then((response) =>
        {
            this.renderHeader(response);
            this.renderTracks(response);
        });

        this.addEventListener('item-selected', this.onItemSelected.bind(this));
        this.classList.add('release-view');
    }

    renderHeader(response) 
    {
        this.createAndAttach('div', { class: 'release-view-header'}, [
            this.create('img', {src: response.data.thumbnail || 'dist/img/missing-cover-art.webp' }),
            this.create('div', {class: 'release-view-label'}, [
                this.create('h1', null, response.data.title),
                this.create('h3', null, this.create('a', { href: '#discover:releases?artist=' + response.data.artist }, response.data.artist))
            ]),
            this.$refs.addButton = this.create('button', null, this.createAndAttach('span', {class: 'fa fa-plus'}))
        ]);

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
        for (var t of response.data.tracks) {
            this.append(PlaylistItem.instantiate({ title: t, artist: response.data.artist, album: response.data.title }))
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

        var context = QueueContextRelease(
            this.api
        );

        var queue = Queue.instantiate(initialBatch, context);
        evt.detail.queue = queue;
    }
}

Release.register();

export default Release;
