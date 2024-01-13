import CustomElement    from './CustomElement';
import AppNavigation    from './Component/AppNavigation';
import ReproductionControls from './Component/ReproductionControls';
//-------------------------------------------------------------------
import ViewWelcome      from './View/ViewWelcome';
import ViewPlaylist     from './View/ViewPlaylist';
import ViewReleases     from './View/ViewDiscoverReleases';
import ViewRelease      from './View/ViewRelease';
import ViewSearch       from './View/ViewSearch';
import ViewDiscover     from './View/ViewDiscoverArtists';
import ViewNotFound     from './View/ViewNotFound';

import QueueDisplay     from './QueueDisplay';
//-------------------------------------------------------------------
import ModalAddToPlaylist from './Component/Modal/ModalAddToPlaylist';
import ModalItemAdd from './Component/Modal/ModalItemAdd';
import ModalItemEdit from './Component/Modal/ModalItemEdit';
import ModalPlaylistAdd from './Component/Modal/ModalPlaylistAdd';
import ModalPlaylistEdit from './Component/Modal/ModalPlaylistEdit';
//-------------------------------------------------------------------
import QueueContextPlaylist from '../../Queue/QueueContextPlaylist';
import QueueContextSearch from '../../Queue/QueueContextSearch';
import QueueContextRelease from '../../Queue/QueueContextRelease';

import Queue from '../../Queue/Queue';
import History from '../../Queue/History';
import State from '../../State/State';


import TabManager from 'tabbed-router';
import { HashRequest } from 'tabbed-router';
// import { Route } from 'tabbed-router';
import { RouteCollection } from 'tabbed-router';
import { TabLink } from 'tabbed-router';
import { TabPanel } from 'tabbed-router';

customElements.define('tab-manager', TabManager);
customElements.define('tab-link', TabLink);
customElements.define('tab-panel', TabPanel);

class App extends CustomElement
{
    static elementName = 'the-app';

    __construct(api) 
    {
        this.api             = api;
        this.routeCollection = this.setUpRouteCollection(api);
        this.state           = new State('showrunner.state');

        //--------------------------------------------------

        this.setHistory(this.loadHistory(), false);
        this.setQueue(this.loadQueue(), false);
        this.updateReproductionTray();

        //--------------------------------------------------

        this.addEventListener('item-selected', this.onItemSelected.bind(this));
        this.addEventListener('player:ended', this.onPlayerEnded.bind(this));
        this.addEventListener('controls:forward', this.forwardTheQueue.bind(this));
        this.addEventListener('controls:backward', this.rewindTheQueue.bind(this));
        this.addEventListener('queue:jump', this.onJumpLine.bind(this));
        this.addEventListener('play-item-next', this.onPlayNext.bind(this));
    }

    saveHistory(history) 
    {
        this.state.set('history', history);
    }

    loadHistory() 
    {
        if (!this.state.get('history')) {
            return new History([]);
        }

        var history = new History();
        history.add(this.state.get('history'));

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

        switch (c.id) {
            case QueueContextPlaylist.id() :
                return QueueContextPlaylist.unserialize(this.api, c);
                break;
            case QueueContextSearch.id() :
                return QueueContextSearch.unserialize(this.api, c);
                break;
            case QueueContextRelease.id() :
                return QueueContextRelease.unserialize(this.api, c);
                break;
        }

        return null;
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
            this.$refs.controls = ReproductionControls.instantiate(this.api)
        ]);

        var mainTab = this.$refs.stage.createTab('main-tab', true);

        var home = Request.createFromHref('#home');
        home.meta.title = 'Home';
        mainTab.goTo(home);

        //------------------------------

        this.addEventListener('playlist-added', () =>
        {
            this.$refs.navMenu.render();
        });

        this.addEventListener('playlist-updated', () =>
        {
            this.$refs.navMenu.render();
        });

        this.addEventListener('item-to-add', (evt) => 
        {
            var modal = ModalAddToPlaylist.instantiate(this.api, evt.detail.items);
            this.append(modal);
        });

        this.addEventListener('add-item', (evt) => 
        {
            var modal = ModalItemAdd.instantiate(this.api, evt.detail.playlist);
            this.append(modal);
        });

        this.addEventListener('edit-item', (evt) => 
        {
            var modal = ModalItemEdit.instantiate(this.api, evt.detail.uuid);
            this.append(modal);
        });

        this.addEventListener('delete-item', (evt) => 
        {
            var doRemove = confirm('Are you sure you want to remove it ?');
            if (doRemove) {
                this.api.collection.playlistItems.get(evt.detail.uuid).delete();
                evt.target.remove();
            }
        });

        this.addEventListener('download-playlists', (evt) => 
        {
            this.api.collection.playlists.downloadAll();
        });

        this.addEventListener('add-playlist', (evt) => 
        {
            var modal = ModalPlaylistAdd.instantiate(this.api);
            this.append(modal);
        });

        this.addEventListener('edit-playlist', (evt) => 
        {
            var modal = ModalPlaylistEdit.instantiate(this.api, evt.detail.playlistId);
            this.append(modal);
        });

        this.addEventListener('delete-playlist', (evt) => 
        {
            if (!confirm('Are you sure you want to delete the playlist ?')) {
                return;
            }

            this.api.collection.playlists.get(evt.detail.playlist).delete().then(() =>
            {
                this.$refs.navMenu.render();
            });

            window.location.hash = '#home';
        });

        this.addEventListener('summon-queue', () => 
        {
            this.$refs.queueDisplay.toggle();
        });

        if (this.queue.length) {
            this.setupItem(this.queue[0], false);
        }

        this.updateReproductionTray();
    }

    setUpRouteCollection(api) 
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
        .createRoute(/discover:releases$/, function(request) 
        {
            return ViewReleases.instantiate(request, api);
        })
        .createRoute(/discover:release:(?<releaseId>.+)/, function(request) 
        {
            return ViewRelease.instantiate(request, api);
        });

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

    onPlayNext(evt) 
    {
        var { item } = evt.detail;
        if (this.queue.length == 0) {
            this.playItem(item)
        } else {
            this.queue.jump(item, 1);
        }
    }

    async onItemSelected(evt) 
    {
        var { item, queue } = evt.detail;

        console.log('-------------------------------');
        console.log('Show runner: New item selected');

        return queue
            ? this.playNewQueue(queue)
            : this.jumpTheQueue(item);
    }

    /**
     * Keeps queue, but jump item to the front of it.
     */
    async jumpTheQueue(item) 
    {
        this.queue.dropIn(item);
        // add previous to history etc
        return this.playItem(item);
    }

    /**
     * Clears old queue, set this new one up.
     */
    async playNewQueue(queue) 
    {
        var oldQueue = this.queue;

        if (oldQueue.front) {
            this.addToHistory(oldQueue.front);
        }

        this.setQueue(queue);

        return this.playItem(this.queue.front);
    }

    setHistory(history, save = true) 
    {
        this.history = history;
        if (save) {
            this.saveHistory(history);
        }

        this.history.updatedCallback = () =>
        {
            var resume = this.history.slice(0, 30);
            this.saveHistory(resume);
            this.updateReproductionTray();
        }
        this.updateReproductionTray();
    }

    setQueue(queue, save = true) 
    {
        this.queue = queue;
        if (save) {
            this.saveQueue(queue);
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
            this.$refs.queueDisplay.showQueue(this.queue, this.history);
        }
    }

    async onPlayerEnded(evt) 
    {
        console.log('-------------------------------');
        console.log('Show runner: song ended, next.');
        return this.advanceTheQueue();
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
            this.addToHistory(this.queue.front);
            this.queue.dequeue();

            if (next) {
                return this.playItem(next);
            } else {
                console.log('Showrunner: Nothing else to play');
            }
        });
    }

    addToHistory(item) 
    {
        this.history.add(item);
    }

    async playItem(item) 
    {
        return this.setupItem(item, true);
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
        this.$refs.controls = ReproductionControls.instantiate(this.api, item, resources, autoPlay);
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

        return this.api.discover.resources(params);
    }
}

App.register();

export default App;