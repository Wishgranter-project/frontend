import BaseView        from './BaseView';

/**
 * Abstract view.
 */
class MusicPlayingView extends BaseView 
{
    /**
     * Return the playable items displayed in this view.
     *
     * @param {Object} beginningWith
     * Beginning with this one.
     *
     * @returns {Array}
     * Of playable items.
     */
    getPlayableItems(beginningWith = null)
    {
        var initialBatch = this.$refs.playlist.getItems();

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
