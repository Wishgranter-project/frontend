import CustomElement    from './CustomElement';
import AppNavigation    from './Component/AppNavigation';
import ReproductionControls from './Component/ReproductionControls';
import ViewWelcome      from './View/Welcome';

import ViewPlaylist     from './View/Playlist';

import ViewReleases     from './View/DiscoverReleases';

import ViewRelease      from './View/Release';
import ViewSearch       from './View/Search';
import ViewDiscover     from './View/DiscoverArtists';

import ViewNotFound     from './View/NotFound';
import Router           from '../Routing/Router.js';

import ShowRunner       from './ShowRunner';

import QueueDisplay     from './QueueDisplay';

import ModalAddToPlaylist from './Component/ModalAddToPlaylist';
import ModalItemAdd from './Component/ModalItemAdd';
import ModalItemEdit from './Component/ModalItemEdit';
import ModalPlaylistAdd from './Component/ModalPlaylistAdd';
import ModalPlaylistEdit from './Component/ModalPlaylistEdit';

class App extends CustomElement
{
    static elementName = 'the-app';

    __construct(api) 
    {
        this.api        = api;
        this.router     = this.setUpRouter(api);
        this.showRunner = new ShowRunner(this, api);
    }

    render() 
    {
        this.classList.add('app');

        this.$refs.middle = this.createAndAttach('div', {class: 'app__middle'}, [
            this.$refs.navMenu = AppNavigation.instantiate(this.api),
            this.$refs.stage = this.create('div', {class: 'app__stage', id: 'stage'}),
            this.$refs.queueDisplay = QueueDisplay.instantiate()
        ]);

        this.$refs.footer = this.createAndAttach('div', {class: 'app__footer'}, [
            this.$refs.controls = ReproductionControls.instantiate(this.api)
        ]);

        this.router.setStage(this.$refs.stage);
        this.router.listenToChanges();

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
            var doRemove = confirm('Are you sure you want to delete the playlist ?');
            if (doRemove) {
                this.api.collection.playlists.get(evt.detail.playlist).delete().then(() =>
                {
                    this.$refs.navMenu.render();
                });
                window.location.hash = '#home';
            }
        });

        this.addEventListener('summon-queue', () => 
        {
            this.$refs.queueDisplay.toggle();
        });
    }

    playItem(item, resources) 
    {
        this.$refs.controls.destroyPlayer().remove();
        this.$refs.controls = ReproductionControls.instantiate(this.api, item, resources);
        this.$refs.footer.append(this.$refs.controls);
    }

    setUpRouter(api) 
    {
        var router = new Router();

        router
        .addRouter([/^$/, /home$/], function(request)
        {
            return ViewWelcome.instantiate(request, api);
        })
        .addRouter(/playlist:(?<playlistId>[\w\d\-]+)$/, function(request) 
        {
            return ViewPlaylist.instantiate(request, api);
        })
        .addRouter(/playlist:(?<playlistId>[\w\d\-]+)\/edit/, function(request) 
        {
            return ViewEditPlaylist.instantiate(request, api);
        })
        .addRouter(/search/, function(request) 
        {
            return ViewSearch.instantiate(request, api);
        })
        .addRouter(/discover:artist/, function(request) 
        {
            return ViewDiscover.instantiate(request, api);
        })
        .addRouter(/discover:releases$/, function(request) 
        {
            return ViewReleases.instantiate(request, api);
        })
        .addRouter(/discover:release:(?<releaseId>.+)/, function(request) 
        {
            return ViewRelease.instantiate(request, api);
        })
        .addRouter(/playlist\/create/, function(request) 
        {
            return ViewAddPlaylist.instantiate(request, api);
        })
        .notFoundCallback = function(route, request) 
        {
            return ViewNotFound.instantiate(request, api);
        };

        return router;
    }
}

App.register();

export default App;