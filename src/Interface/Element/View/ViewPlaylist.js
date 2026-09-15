import ViewSearch        from './ViewSearch';
import SearchHeader      from '../Component/SearchHeader';
import Events            from '../../../Helper/Events';
import Queue             from '../../../Line/Queue';
import ContextPlaylist   from '../../../Line/ContextPlaylist';

/**
 * Displays the contents of a playlist.
 */
class ViewPlaylist extends ViewSearch
{
    static elementName = 'view-playlist';

    async render()
    {
        this.classList.add('view');
        this.classList.add(ViewPlaylist.elementName);

        this.setAttribute('data-playlist', this.hashRequest.attributes.playlistId);

        await this.fetchPlaylist().then((response) =>
        {
            return this.subRenderHeader(response);
        });

        this.fetchItems().then((response) =>
        {
            this.response = response;
            this.subRenderItems(response);
            this.subRenderNavigation(response);
        });

        this.addEventListener('queue:intention:play-this-now', this.onItemSelected.bind(this));
        this.addEventListener('list-of-items:reordered', this.onItemsReordered.bind(this));
    }

    /**
     * @inheritdoc
     */
    fetchItems()
    {
        const search = this.buildSearch(this.hashRequest.queryParams);        
        return search.fetch();
    }

    /**
     * Gets name and description for the playlist.
     *
     * @returns {Promise}
     * To be resolved when the server responds.
     */
    fetchPlaylist()
    {
        return this.collection
            .managePlaylist(this.hashRequest.attributes.playlistId)
            .fetch();
    }

    /**
     * @inheritdoc
     */
    buildSearch(queryParams)
    {
        const search = super.buildSearch(queryParams);
        search.condition('playlistId', this.hashRequest.attributes.playlistId);
        return search;
    }

    subRenderHeader(response)
    {
        super.subRenderHeader(response);

        this.$refs.buttons = this.$refs.headerF.createAndAttach('div', { class: 'button-group' }, [
            this.$refs.buttonAdd = this.create('button', { title: 'Add new item to playlist' }, this.create('span', { class: 'fa fa-plus' })),
            this.$refs.buttonEdit = this.create('button', { title: 'Edit playlist' }, this.create('span', { class: 'fa fa-pencil' })),
            this.$refs.buttonDownload = this.create('button', { title: 'Download playlist' }, this.create('span', { class: 'fa fa-download' })),
            this.$refs.buttonDelete = this.create('button', { title: 'Delete entire playlist', class: 'btn-danger' }, this.create('span', { class: 'fa fa-close' }))
        ]);

        if (response.data.description) {
            this.$refs.headerH.createAndAttach('h3', null, response.data.description);
        }

        this.$refs.buttonAdd.addEventListener('click', () => 
        {
            this.fireEvent('item:intention:compose-new', { playlistId: this.hashRequest.attributes.playlistId });
        });

        this.$refs.buttonEdit.addEventListener('click', () => 
        {
            this.fireEvent('playlist:intention:edit', { playlistId: this.hashRequest.attributes.playlistId });
        });

        this.$refs.buttonDownload.addEventListener('click', () =>
        {
            this.fireEvent('playlist:intention:download', { playlistId: this.hashRequest.attributes.playlistId });
        });

        this.$refs.buttonDelete.addEventListener('click', () => 
        {
            this.fireEvent('playlist:intention:delete', { playlistId: this.hashRequest.attributes.playlistId });
        });
    }

    onItemSelected(evt)
    {
        var context      = new ContextPlaylist(this.collection, false, this.hashRequest.queryParams, this.hashRequest.attributes.playlistId);
        var initialBatch = this.getPlayableItems(evt.detail.item);
        var queue        = Queue.instantiate(initialBatch, context)
        
        evt.detail.queue = queue;
    }

    onItemsReordered(evt)
    {
        var changes = evt.detail.changes;
        var offset = (this.response.meta.currentPage - 1) * this.response.meta.itemsPerPage;
        var promises = [];

        for (var c of changes) {
            c.from += offset;
            c.to += offset;

            c.item.position = c.to;
            promises.push(this.collection.manageItem(c.item.uuid).update(c.item));
        }

        Promise.all(promises).then(() =>
        {
            console.log('playlist: reordered items');
        });
    }
}

ViewPlaylist.register();

export default ViewPlaylist;
