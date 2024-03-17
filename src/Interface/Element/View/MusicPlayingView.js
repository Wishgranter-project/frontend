import BaseView        from './BaseView';
import PlaylistItem    from '../Component/PlaylistItem';

class MusicPlayingView extends BaseView 
{
    getPlayableItems(beginningWith = null)
    {
        var initialBatch = [];
        for (var element of this.querySelectorAll(PlaylistItem.elementName)) {
            initialBatch.push(element.item);
        }

        for (var key in initialBatch) {
            if (initialBatch[key] == beginningWith) {
                initialBatch = initialBatch.slice(key);
                break;
            }
        }

        return initialBatch;
    }
}

export default MusicPlayingView;
