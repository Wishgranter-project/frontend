import CustomElement        from './CustomElement';
import AppNavigation        from './Component/Navigation/AppNavigation';
import ReproductionControls from './Component/ReproductionControls';
//=============================================================================
import ViewWelcome          from './View/ViewWelcome';
import ViewPlaylist         from './View/ViewPlaylist';
import ViewAlbums           from './View/ViewDiscoverAlbums';
import ViewSearch           from './View/ViewSearch';
import ViewDiscover         from './View/ViewDiscoverArtists';
import QueueDisplay         from './QueueDisplay';
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
import Serialization        from '../../Helper/Serialization';
import Instantiator         from '../../Helper/Instantiator';
//=============================================================================
import TabManager, { 
    TabPanel,
    TabButton,
    TabsBar,
    TabControls,
    RouteCollection,
    HashRequest,
} from 'tabbed-router';
//=============================================================================

customElements.define('tab-manager',  TabManager);
customElements.define('tab-panel',    TabPanel);
customElements.define('tab-link',     TabButton);
customElements.define('tab-links',    TabsBar);
customElements.define('tab-controls', TabControls);

class App extends CustomElement
{
    static elementName = 'the-app';

    __construct(api)
    {
        super.__construct();
        this.api                 = api;
        this.routeCollection     = this.instantiateRouteCollection(api);
        this.state               = new State('showrunner.state');
        this.navigationState     = new State('navigation.state');
        this.contextFactory      = new ContextFactory(api);

        //--------------------------------------------------

        this.setHistory(this.loadHistory());

        var queue = this.loadQueue();
        if (this.isShuffleOn() && !queue.isShuffled()) {
            queue.shuffle();
        } else if (!this.isShuffleOn() && queue.isShuffled()) {
            queue.unshuffle();
        }

        this.setQueue(this.loadQueue());
        this.updateReproductionTray();

        //--------------------------------------------------
    }

    saveHistory(history)
    {
        this.state.set('history', history);
    }

    loadHistory()
    {
        var history = new History();

        if (!this.state.get('history')) {
            return history;
        }

        var items = this.state.get('history');
        if (items == null || items.length == 0) {
            return history;
        }

        history.add(items);
        return history;
    }

    saveQueue(queue)
    {
        if (queue.context) {
            this.saveQueueContext(queue.context);
        }

        this.state.set('queue', queue);
    }

    loadQueue()
    {
        if (!this.state.get('queue')) {
            return Queue.instantiate([], null);
        }

        var context = this.loadQueueContext();

        var items = this.state.get('queue');

        var queue = Queue.instantiate(items, context);

        return queue;
    }

    saveQueueContext(context)
    {
        this.state.set('queueContext', context.serialize());
    }

    loadQueueContext()
    {
        if (!this.state.get('queueContext')) {
            return null;
        }

        var c = this.state.get('queueContext');

        return this.contextFactory.instantiate(c);
    }

    render()
    {
        this.classList.add('app');

        this.$refs.stage = new TabManager();
        this.$refs.stage.classList.add('app__stage');
        this.$refs.stage.setAttribute('id', 'stage');
        this.$refs.stage.setRouteCollection(this.routeCollection);

        this.$refs.middle = this.createAndAttach('div', {class: 'app__middle'}, [
            this.$refs.navMenu = AppNavigation.instantiate(this.api),
            this.$refs.stage,
            this.$refs.queueDisplay = QueueDisplay.instantiate()
        ]);

        this.$refs.footer = this.createAndAttach('div', {class: 'app__footer'}, [
            this.$refs.controls = ReproductionControls.instantiate(this.api, null, null, null, this.isShuffleOn())
        ]);      

        if (!this.restoreTabs()) {
            this.openHomePage();
        }

        //------------------------------

        this.addEventListener('queue:item-selected',               this.onItemSelected.bind(this));
        this.addEventListener('playable:ended',                    this.onPlayerEnded.bind(this));
        this.addEventListener('player:intention:toggle-shuffle',   this.toggleShuffle.bind(this));
        this.addEventListener('queue:intention:forward',           this.forwardTheQueue.bind(this));
        this.addEventListener('queue:intention:backward',          this.rewindTheQueue.bind(this));
        this.addEventListener('queue:intention:jump',              this.onJumpLine.bind(this));
        this.addEventListener('queue:intention:play-it-next',      this.onPlayNext.bind(this));
        this.addEventListener('tabbed-router:tab-updated',         this.onNavigationUpdate.bind(this));

        this.addEventListener('playlist:added', () =>
        {
            this.$refs.navMenu.render();
        });

        this.addEventListener('playlist:updated', () =>
        {
            this.$refs.navMenu.render();
        });

        this.addEventListener('item:intention:add-to-collection', (evt) => 
        {
            var modal = ModalAddToPlaylist.instantiate(this.api, evt.detail.items);
            this.append(modal);
        });

        this.addEventListener('playlist:intention:compose-new-item', (evt) => 
        {
            var modal = ModalItemAdd.instantiate(this.api, evt.detail.playlistId);
            this.append(modal);
        });

        this.addEventListener('item:intention:edit', (evt) => 
        {
            var modal = ModalItemEdit.instantiate(this.api, evt.detail.uuid);
            this.append(modal);
        });

        this.addEventListener('item:intention:delete', (evt) => 
        {
            var doRemove = confirm('Are you sure you want to remove it from your collection ?');
            if (doRemove) {
                this.api.collection.playlistItems.get(evt.detail.uuid).delete();
                evt.target.remove();
            }
        });

        this.addEventListener('collection:intention:download', (evt) => 
        {
            this.api.collection.playlists.downloadAll();
        });

        this.addEventListener('collection:intention:compose-new-playlist', (evt) => 
        {
            var modal = ModalPlaylistAdd.instantiate(this.api);
            this.append(modal);
        });

        this.addEventListener('playlist:intention:edit', (evt) => 
        {
            var modal = ModalPlaylistEdit.instantiate(this.api, evt.detail.playlistId);
            this.append(modal);
        });

        this.addEventListener('playlist:intention:delete', (evt) => 
        {
            if (!confirm('Are you sure you want to delete the playlist ?')) {
                return;
            }

            this.api.collection.playlists.get(evt.detail.playlistId).delete().then(() =>
            {
                this.$refs.navMenu.render();
            });

            window.location.hash = '#home';
        });

        this.addEventListener('gui:summon-queue', () => 
        {
            this.$refs.queueDisplay.toggle();
        });

        if (this.queue.length) {
            this.setupItem(this.queue[0], false);
        }

        this.updateReproductionTray();
    }

    instantiateRouteCollection(api)
    {
        var collection = new RouteCollection();

        collection
        .createRoute([/^$/, /home$/], function(request)
        {
            return ViewWelcome.instantiate(request, api);
        })
        .createRoute(/playlist:(?<playlistId>[\w\d\-]+)$/, function(request) 
        {
            return ViewPlaylist.instantiate(request, api);
        })
        .createRoute(/search/, function(request) 
        {
            return ViewSearch.instantiate(request, api);
        })
        .createRoute(/discover:artist/, function(request) 
        {
            return ViewDiscover.instantiate(request, api);
        })
        .createRoute(/discover:albums$/, function(request) 
        {
            return ViewAlbums.instantiate(request, api);
        })

        /*
        .notFoundCallback = function(route, request) 
        {
            return ViewNotFound.instantiate(request, api);
        };
        */

        return collection;
    }

    async onJumpLine(evt)
    {
        var { from, to } = evt.detail;
        var target = this.queue.move(from, to);

        if (to == 0) {
            this.playItem(target);
        }
    }

    async onPlayerEnded(evt)
    {
        console.log('-------------------------------');
        console.log('Show runner: song ended, next.');
        return this.advanceTheQueue();
    }

    isShuffleOn()
    {
        return this.state.get('shuffle') == 1;
    }

    toggleShuffle(evt)
    {
        this.isShuffleOn()
            ? this.turnShuffleOff()
            : this.turnShuffleOn();
    }

    turnShuffleOff()
    {
        this.state.set('shuffle', 0);
        this.$refs.controls.turnShuffleOff();

        if (!this.queue) {
            return;
        }

        this.queue.unshuffle();
        this.saveQueue(this.queue);
    }

    turnShuffleOn()
    {
        this.state.set('shuffle', 1);
        this.$refs.controls.turnShuffleOn();

        if (!this.queue) {
            return;
        }

        this.queue.shuffle();
        this.saveQueue(this.queue);
    }

    onPlayNext(evt)
    {
        var { item } = evt.detail;

        this.queue.length == 0
            ? this.playItem(item)
            : this.queue.jump(item, 1);
    }

    /**
     * Clears old queue, set this new one up.
     */
    async stopAndBeginThisNewQueue(queue)
    {
        var oldQueue = this.queue;

        if (oldQueue.front) {
            this.history.add(oldQueue.front);
        }

        if (this.isShuffleOn()) {
            queue.shuffle(true);
        }

        this.setQueue(queue);
        this.saveQueue(queue);

        return this.playItem(this.queue.front);
    }

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
        if (this.$refs.queueDisplay) {
            this.$refs.queueDisplay.refresh(this.queue, this.history);
        }
    }

    async rewindTheQueue(evt)
    {
        if (! this.history.length) {
            return;
        }

        console.log('-------------------------------');
        console.log('Show runner: rewinding queue.');

        var previous = this.history.rewind(1)[0];
        this.queue.dropIn(previous);

        return this.playItem(previous);
    }

    async forwardTheQueue(evt)
    {
        console.log('-------------------------------');
        console.log('Show runner: song skipped, next.');
        return this.advanceTheQueue();
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

    async onItemSelected(evt)
    {
        var { item, queue } = evt.detail;

        console.log('-------------------------------');
        console.log('Show runner: New item selected');

        // Has a queue attached to it ?
        if (queue && queue.length) {
            return this.stopAndBeginThisNewQueue(queue);
        } else {
            var current = this.queue.dequeue();
            if (current) {
                // Add the one in front to the history.
                this.history.add(current);
            }

            // Add item to the beginning of the queue.
            this.queue.dropIn(item);
            // add previous to history etc
            return Array.isArray(item)
                ? this.playItem(item[0])
                : this.playItem(item);
        }
    }

    async playItem(item)
    {
        //return this.setupItem(item, true);
        var isAlbum = item.hasOwnProperty('album') && !item.hasOwnProperty('title');
        if (isAlbum) {
            var artist = Array.isArray(item.artist) ? item.artist[0] : item.artist;
            var album = item.album;

            var tracks = await this.api.discover.albums.get(artist, album).fetchItems();

            // Remove the album from the queue...
            this.queue.dequeue();
            // and drop in its tracks.
            this.queue.dropIn(tracks);
            return this.setupItem(this.queue.front, true);
        } else {
            return this.setupItem(item, true);
        }
    }

    async setupItem(item, play = true)
    {
        return this.findResourcesForMusicalItem(item).then( (response) =>
        {
            if (!response.data.length) {
                alert('Show runner: Nothing found to play');
                return;
            }

            this.setupResources(item, response.data, play);
            return response;
        });
    }

    setupResources(item, resources, autoPlay = true)
    {
        this.$refs.controls.remove();
        this.$refs.controls = ReproductionControls.instantiate(this.api, item, resources, autoPlay, this.isShuffleOn());
        this.$refs.footer.append(this.$refs.controls);
    }

    /**
     * Finds resources for item to be played
     *
     * @param object item
     *   The item describing the song.
     *
     * @return Promise 
     */
    async findResourcesForMusicalItem(item)
    {
        console.log('Show runner: searching for source to play');

        var params = {}

        if (item.title) {
            params.title = item.title;
        }

        // Give preference for soundtracks.
        if (item.soundtrack && item.soundtrack.length) {
            params.soundtrack = item.soundtrack;
        } else if (item.artist && item.artist.length) {
            params.artist = item.artist;
        }

        if (item.genre) {
            params.genre = Array.isArray(item.genre)
                ? item.genre[0]
                : item.genre;
        }

        return this.api.discover.resources(params);
    }

    onNavigationUpdate(evt)
    {
        this.saveTabs();
    }

    saveTabs()
    {
        var requests = [];

        for (var tab of this.$refs.stage.getTabs()) {
            var request = tab.childNodes[0] && tab.childNodes[0].request
                ? tab.childNodes[0].request
                : null;

            if (request) {
                requests.push(Serialization.serialize(request));
            }
        }
        
        this.navigationState.set('requests', requests);
    }

    restoreTabs()
    {
        var requests = this.loadTabs();
        var focus = false;
        var n = 0;
        for (var r of requests) {
            focus = n == requests.length -1;
            this.$refs.stage.openInNewTab(r, focus);
            n++;
        }

        return requests.length;
    }

    openHomePage()
    {
        var mainTab = this.$refs.stage.createTab('main-tab', true);
        mainTab.access('#home');
    }

    loadTabs()
    {
        var serializedRequests = this.navigationState.get('requests', []);
        var requests = [];
        var ins;

        for (var s of serializedRequests) {
            var instantiator = new Instantiator(HashRequest, s);
            var ins = instantiator.instantiate();
            requests.push(ins);
        }

        return requests;
    }
}

App.register();

export default App;