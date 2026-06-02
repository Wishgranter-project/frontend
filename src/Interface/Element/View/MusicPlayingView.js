import BaseView        from './BaseView';

/**
 * @abstract
 */
class MusicPlayingView extends BaseView
{
    /** @inheritdoc */
    __construct(hashRequest, api)
    {
        super.__construct(hashRequest, api);
        this.collection = api.manageUser(hashRequest.attributes.userId).collection;
    }

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
