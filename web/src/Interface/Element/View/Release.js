import ViewElement from './ViewElement';
import PlaylistItem from '../Component/PlaylistItem';
//import ViewHeader from '../Component/SearchHeader';
import QueueContextRelease from '../QueueContextRelease';

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
    }

    renderHeader(response) 
    {
        this.createAndAttach('h1', null, [response.data.artist, ' ', response.data.title]);
        //var header = ViewHeader.instantiate(this.api, this.request, 'fuck');
        //this.append(header);
    }

    async renderTracks(response) 
    {
        for (var t of response.data.tracks) {
            this.append(PlaylistItem.instantiate({ title: t, artist: response.data.artist }))
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

        evt.detail.context = new QueueContextRelease(
            initialBatch,
            this.api
        );
    }
}

Release.register();

export default Release;
