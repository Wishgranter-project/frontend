import ViewElement from './ViewElement';
import PlaylistItem from '../Component/PlaylistItem';
import ViewHeader from '../Component/SearchHeader';

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

}

Release.register();

export default Release;
