import CustomElement        from './CustomElement';
import AppNavigation        from './Component/Navigation/AppNavigation';
import ReproductionControls from './Component/ReproductionControls';
//=============================================================================
import QueueDisplay         from './QueueDisplay';
import Stage                from './Stage';
//=============================================================================
import ModalAddToPlaylist   from './Component/Modal/ModalAddToPlaylist';
import ModalItemAdd         from './Component/Modal/ModalItemAdd';
import ModalItemEdit        from './Component/Modal/ModalItemEdit';
import ModalPlaylistAdd     from './Component/Modal/ModalPlaylistAdd';
import ModalPlaylistEdit    from './Component/Modal/ModalPlaylistEdit';
//=============================================================================
import Queue                from '../../Line/Queue';
import History              from '../../Line/History';
import ContextFactory       from '../../Line/ContextFactory';
import State                from '../../State/State';
//=============================================================================
import PlaylistItem         from './Component/PlaylistItem';

class App extends CustomElement
{
    /** @inheritdoc */
    static elementName = 'the-app';

    /**
     * Constructor.
     *
     * @param {Api} api
     * To communicate with the backend.
     * @param {String} userId
     * The authenticated user's id.
     */
    __construct(api, userId)
    {
        super.__construct();
        this.api                 = api;
        this.userId              = userId;
        this.collection          = api.manageUser(userId).collection;
        this.state               = {
            queue:      new State('state.queue'),
            history:    new State('state.history'),
        }
        this.contextFactory      = new ContextFactory(this.api, this.collection);

        //--------------------------------------------------

        this.setHistory(this.loadHistory());

        var queue = this.loadQueue();
        if (this.isShuffleOn && !queue.isShuffled()) {
            queue.shuffle();
        } else if (!this.isShuffleOn && queue.isShuffled()) {
            queue.unshuffle();
        }

        this.setQueue(this.loadQueue());
        this.updateReproductionTray();
    }

    /** @inheritdoc */
    render()
    {
        this.classList.add('app');

        this.$refs.stage = new Stage();
        this.$refs.stage.instantiateRouteCollection(this.api);

        this.$refs.middle = this.createAndAttach('div', {class: 'app__middle'}, [
            this.$refs.navMenu = AppNavigation.instantiate(this.api, this.userId),
            this.$refs.stage,
            this.$refs.queueDisplay = QueueDisplay.instantiate(this.userId)
        ]);

        this.$refs.footer = this.createAndAttach('div', {class: 'app__footer'}, [
            this.$refs.controls = ReproductionControls.instantiate(this.api, this.userId, null, null, null, this.isShuffleOn)
        ]);      

        if (!this.$refs.stage.restoreTabs()) {
            this.$refs.stage.openHomePage();
        }

        //------------------------------

        this.addEventListeners({
            'playable:ended':                    this.onTrackHasFinished.bind(this),
            'player:intention:toggle-shuffle':   this.onRequestToToggleShuffle.bind(this),

            'queue:intention:play-this-now':     this.onRequestToPlayNewItem.bind(this),
            'queue:intention:forward':           this.onRequestToForwardQueue.bind(this),
            'queue:intention:rewind':            this.onRequestToRewindQueue.bind(this),
            'queue:intention:play-it-next':      this.onRequestToPlayItemNext.bind(this),

            'collection:intention:download':     this.onRequestToDownloadCollection.bind(this),

            'item:newly-created':                this.onNewItemCreated.bind(this),
            'item:updated':                      this.onItemUpdated.bind(this),
            'item:intention:compose-new':        this.onRequestToComposeNewItem.bind(this),
            'item:intention:edit':               this.onRequestToEditItem.bind(this),
            'item:intention:delete':             this.onRequestToDeleteItem.bind(this),
            'item:intention:add-to-collection':  this.onRequestToAddItemToCollection.bind(this),

            'playlist:newly-created':            this.onNewPlaylistCreated.bind(this),
            'playlist:updated':                  this.onNewPlaylistUpdated.bind(this),
            'playlist:intention:compose-new':    this.onRequestToComposeNewPlaylist.bind(this),
            'playlist:intention:edit':           this.onRequestEditPlaylist.bind(this),
            'playlist:intention:delete':         this.onRequestDeletePlaylist.bind(this),
            'playlist:intention:download':       this.onRequestDownloadPlaylist.bind(this),
            'gui:summon-queue':                  this.onSummonQueue.bind(this)
        });

        if (this.queue.length) {
            this.setupItem(this.queue[0], false);
        }

        this.updateReproductionTray();
    }

    get isShuffleOn()
    {
        return this.state.queue.get('shuffle') == 1;
    }

    turnShuffleOff()
    {
        this.state.queue.set('shuffle', 0);
        this.$refs.controls.turnShuffleOff();

        if (!this.queue) {
            return;
        }

        this.queue.unshuffle();
        this.saveQueue(this.queue);
    }

    turnShuffleOn()
    {
        this.state.queue.set('shuffle', 1);
        this.$refs.controls.turnShuffleOn();

        if (!this.queue) {
            return;
        }

        this.queue.shuffle();
        this.saveQueue(this.queue);
    }

    /**
     * Commits the reproduction history to memory.
     *
     * @protected
     *
     * @param {History} history
     * History object.
     */
    saveHistory(history)
    {
        this.state.history.set('items', history);
    }

    /**
     * Loads the reproduction history from memory.
     *
     * @protected
     *
     * @returns {History}
     * History object.
     */
    loadHistory()
    {
        const history = new History();
        const items = this.state.history.get('items');

        if (items && items.length) {
            history.add(items);
        }

        return history;
    }

    /**
     * Set the active reproduction history.
     *
     * @protected
     *
     * @param {History} history
     * History object.
     */
    setHistory(history)
    {
        this.history = history;

        this.history.updatedCallback = () =>
        {
            var resume = this.history.slice(0, 30);
            this.saveHistory(resume);
            this.updateReproductionTray();
        }
        this.updateReproductionTray();
    }

    /**
     * Loads the reproduction queue from memory.
     *
     * @protected
     *
     * @returns {Queue}
     * Queue object.
     */
    loadQueue()
    {
        if (!this.state.queue.get('items')) {
            return Queue.instantiate([], null);
        }

        const context = this.loadQueueContext();
        const items = this.state.queue.get('items');

        return Queue.instantiate(items, context);
    }

    /**
     * Commits the reproduction queue to memory.
     *
     * @protected
     *
     * @param {Queue} queue
     * Queue object.
     */
    saveQueue(queue)
    {
        if (queue.context) {
            this.saveQueueContext(queue.context);
        }

        this.state.queue.set('items', queue);
    }

    /**
     * Commits the queue context to memory.
     * 
     * @param {ContextBase} context
     * Context object.
     */
    saveQueueContext(context)
    {
        this.state.queue.set('context', context.serialize());
    }

    /**
     * Loads the queue context from memory.
     *
     * @protected
     *
     * @returns {ContextBase}
     * Context object.
     */
    loadQueueContext()
    {
        if (!this.state.queue.get('context')) {
            return null;
        }

        const serialized = this.state.queue.get('context');
        return this.contextFactory.instantiate(serialized);
    }

    /**
     * Clears the current queue, sets up a new one.
     *
     * @param {Queue} newQueue
     * The new queue.
     *
     * @returns {Promise}
     * To be solved once we have media to play.
     */
    async stopAndBeginThisNewQueue(newQueue)
    {
        var oldQueue = this.queue;

        if (oldQueue.front) {
            this.history.add(oldQueue.front);
        }

        if (this.isShuffleOn) {
            newQueue.shuffle(true);
        }

        this.setQueue(newQueue);
        this.saveQueue(newQueue);

        return this.playItem(this.queue.front);
    }

    setQueue(queue)
    {
        this.queue = queue;
        if (queue.length <= 1) {
            queue.fetchMore();
        }

        this.queue.updatedCallback = () =>
        {
            this.saveQueue(queue);
            this.updateReproductionTray();
        }

        this.updateReproductionTray();
    }

    updateReproductionTray()
    {
        if (!this.$refs.queueDisplay) {
            return;
        }

        this.$refs.queueDisplay.refresh(this.queue, this.history);
    }

    async advanceTheQueue()
    {
        return this.queue.getNextInLine().then( (next) => 
        {
            var current = this.queue.dequeue();
            this.history.add(current);

            if (!next) {
                console.log('Showrunner: Nothing else to play');
                return;
            }
            
            return this.playItem(next);
        });
    }
 
    async playItem(item)
    {
        //return this.setupItem(item, true);
        var isAlbum = item.hasOwnProperty('album') && !item.hasOwnProperty('title');
        if (!isAlbum) {
            return this.setupItem(item, true);
        }

        var artist = Array.isArray(item.artist) ? item.artist[0] : item.artist;
        var album = item.album;

        var response = await this.api.discover.getAlbum(album, artist).fetch();

        // Remove the album from the queue...
        this.queue.dequeue();
        // and drop in its tracks.
        this.queue.dropIn(response.data.tracks);
        return this.setupItem(this.queue.front, true);
    }

    async setupItem(item, autoPlay = true)
    {
        return this.findResourcesForMusicalItem(item).then( (response) =>
        {
            if (!response.data.length) {
                alert('Show runner: Nothing found to play');
                return;
            }

            this.$refs.controls.remove();
            this.$refs.controls = ReproductionControls.instantiate(this.api, this.userId, item, response.data, autoPlay, this.isShuffleOn);
            this.$refs.footer.append(this.$refs.controls);

            return response;
        });
    }

    /**
     * Finds resources for item to be played
     *
     * @param {object} item
     * The item describing the song.
     *
     * @returns {Promise}
     * To be resolved when the server responds.
     */
    async findResourcesForMusicalItem(item)
    {
        console.log('Show runner: searching for source to play');

        var params = {}
        for (var prp of Object.keys(item)) {
            if (['uuid', 'xxxOriginal'].includes(prp)) {
                continue;
            }

            params[prp] = item[prp];
        }

        return this.api.wish.forMusic(params);
    }

    updateItem(uuid, original, item)
    {
        var query = uuid
            ? `${PlaylistItem.elementName}[data-uuid='${uuid}']`
            : `${PlaylistItem.elementName}[data-original='${original}']`

        PlaylistItem.sanitizeItem(item);

        document.querySelectorAll(query).forEach((el) => {
            for (var prp in item) {
                if (['uuid', 'xxxOriginal'].includes(prp)) {
                    continue;
                }

                el.item[prp] = item[prp];
                el.refresh();
            }
        });
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onTrackHasFinished(evt)
    {
        console.log('-------------------------------');
        console.log('Show runner: song ended, next.');
        this.advanceTheQueue();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToToggleShuffle(evt)
    {
        this.isShuffleOn
            ? this.turnShuffleOff()
            : this.turnShuffleOn();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToPlayNewItem(evt)
    {
        var { item, queue } = evt.detail;

        console.log('-------------------------------');
        console.log('Show runner: New item selected');

        // Has a queue attached to it ?
        if (queue && queue.length) {
            this.stopAndBeginThisNewQueue(queue);
            return;
        }

        var current = this.queue.dequeue();
        if (current) {
            // Add the one in front to the history.
            this.history.add(current);
        }

        // Add item to the beginning of the queue.
        this.queue.dropIn(item);
        // add previous to history etc
        Array.isArray(item)
            ? this.playItem(item[0])
            : this.playItem(item);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToForwardQueue(evt)
    {
        console.log('-------------------------------');
        console.log('Show runner: song skipped, next.');
        this.advanceTheQueue();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToRewindQueue(evt)
    {
        if (! this.history.length) {
            return;
        }

        console.log('-------------------------------');
        console.log('Show runner: rewinding queue.');

        var previous = this.history.rewind(1)[0];
        this.queue.dropIn(previous);

        this.playItem(previous);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToPlayItemNext(evt)
    {
        var { item } = evt.detail;

        this.queue.length == 0
            ? this.playItem(item)
            : this.queue.jump(item, 1);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToDownloadCollection(evt)
    {
        this.collection.downloadAll();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onNewItemCreated(evt)
    {
        var playlistView = document.querySelector(`${ViewPlaylist.elementName}[data-playlist="${evt.detail.playlist}"]`);
        if (!playlistView) {
            return;
        }

        playlistView.itemsAdded(evt.detail.items);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onItemUpdated(evt)
    {
        for (var item of evt.detail.items) {
            this.updateItem(item.uuid, null, item);

            if (item.xxxOriginal) {
                this.updateItem(null, item.xxxOriginal, item);
            }
        }
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToComposeNewItem(evt)
    {
        var modal = ModalItemAdd.instantiate(this.collection, evt.detail.playlistId);
        this.append(modal);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToEditItem(evt)
    {
        var modal = ModalItemEdit.instantiate(this.collection, evt.detail.uuid);
        this.append(modal);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToDeleteItem(evt)
    {
        if (!confirm('Are you sure you want to remove it from your collection ?')) {
            return;
        }

        this.collection.manageItem(evt.detail.uuid).delete();
        evt.target.remove();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToAddItemToCollection(evt)
    {
        var modal = ModalAddToPlaylist.instantiate(this.collection, evt.detail.items);
        this.append(modal);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onNewPlaylistCreated(evt)
    {
        this.$refs.navMenu.refresh();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onNewPlaylistUpdated()
    {
        this.$refs.navMenu.refresh();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestToComposeNewPlaylist(evt)
    {
        var modal = ModalPlaylistAdd.instantiate(this.collection);
        this.append(modal);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestEditPlaylist(evt)
    {
        var modal = ModalPlaylistEdit.instantiate(this.collection, evt.detail.playlistId);
        this.append(modal);
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestDeletePlaylist(evt)
    {
        if (!confirm('Are you sure you want to delete the playlist ?')) {
            return;
        }

        this.collection.managePlaylist(evt.detail.playlistId).delete().then(() =>
        {
            this.$refs.navMenu.refresh();
        });

        window.location.hash = '#home';
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onRequestDownloadPlaylist(evt)
    {
        this.collection.managePlaylist(evt.detail.playlistId).download();
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onSummonQueue()
    {
        this.$refs.queueDisplay.toggle();
    }
}

App.register();

export default App;