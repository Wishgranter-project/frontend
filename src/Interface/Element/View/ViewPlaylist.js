import BaseView     from './BaseView';
import PlaylistItem from '../Component/PlaylistItem';
import SearchHeader from '../Component/SearchHeader';
import Pagination   from '../Component/Pagination';
import Events       from '../../../Helper/Events';

class ViewPlaylist extends BaseView 
{
    static elementName = 'view-playlist';

    async render() 
    {
        this.classList.add('view--playlist');

        await this.fetchPlaylist().then((response) =>
        {
            return this.subRenderHeader(response);
        });

        this.fetchItems().then((response) =>
        {
            this.subRenderItems(response);
            this.subRenderNavigation(response);
        });

        Events.enableBottomReached(this);
        this.addEventListener('scroll:bottom-reached', this.bottomReached.bind(this));
        this.addEventListener('queue:item-selected', this.onItemSelected.bind(this));
    }

    bottomReached(evt) 
    {
        console.log('Bottom of the page reached');
    }

    /**
     * Gets name and description for the playlist. 
     */
    fetchPlaylist() 
    {
        return this.api.collection.playlists
            .get(this.hashRequest.attributes.playlistId)
            .read();
    }

    /**
     * Gets the items in the playlist ( for the current page, that is ).
     */
    fetchItems() 
    {
        return this.api.collection.playlists
            .get(this.hashRequest.attributes.playlistId)
            .getItems(this.hashRequest.queryParams);    
    }

    subRenderHeader(response) 
    {
        this.$refs.header = this.createAndAttach('header', { class: 'header' }, [
            this.$refs.headerH = this.create('div', { class: 'header__header' }),
            this.$refs.headerB = this.create('div', { class: 'header__body' }),
            this.$refs.headerF = this.create('div', { class: 'header__footer' })
        ]);

        this.$refs.headerH.createAndAttach('h1', null, response.data.title);
        if (response.data.description) {
            this.$refs.headerH.createAndAttach('h3', null, response.data.description);
        }

        this.$refs.buttons = this.$refs.headerF.createAndAttach('div', { class: 'button-group' }, [
            this.$refs.buttonAdd = this.create('button', { title: 'Add new item to playlist' }, this.create('span', { class: 'fa fa-plus' })),
            this.$refs.buttonEdit = this.create('button', { title: 'Edit playlist' }, this.create('span', { class: 'fa fa-pencil' })),
            this.$refs.buttonDelete = this.create('button', { title: 'Delete entire playlist', class: 'btn-danger' }, this.create('span', { class: 'fa fa-close' }))
        ]);

        this.$refs.buttonAdd.addEventListener('click', () => 
        {
            this.fireEvent('playlist:intention:compose-new-item', { playlistId: this.hashRequest.attributes.playlistId });
        });

        this.$refs.buttonEdit.addEventListener('click', () => 
        {
            this.fireEvent('playlist:intention:edit', { playlistId: this.hashRequest.attributes.playlistId });
        });

        this.$refs.buttonDelete.addEventListener('click', () => 
        {
            this.fireEvent('playlist:intention:delete', { playlistId: this.hashRequest.attributes.playlistId });
        });

        this.$refs.headerB.append(SearchHeader.instantiate(this.hashRequest, response.data.title, [
            {type: 'search', name: 'title', placeholder: 'Title', class: 'main'},
            {type: 'search', name: 'artist', placeholder: 'Artist'},
            {type: 'search', name: 'genre', placeholder: 'Genre'}
        ]));
    }

    async subRenderItems(response) 
    {
        if (!response.data) {
            return;
        }

        this.$refs.playlist = this.createAndAttach('div', { class: 'playlist' });

        for (var item of response.data) {
            this.$refs.playlist.attach(PlaylistItem.instantiate(item));
        }
    }

    subRenderNavigation(response) 
    {
        this.append(Pagination.instantiate(this.api, this.hashRequest, response));
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

        evt.detail.initialBatch = initialBatch;
        evt.detail.meta = {
            id: 'playlist',
            noMore: false,
            queryParams: this.hashRequest.queryParams,
            playlistId: this.hashRequest.attributes.playlistId
        };
    }
}

ViewPlaylist.register();

export default ViewPlaylist;
