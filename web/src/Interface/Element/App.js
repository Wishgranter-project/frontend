import CustomElement    from './CustomElement';
import NavMenu          from './Component/NavMenu';
import ReproductionControls from './Component/ReproductionControls';
import ViewWelcome      from './View/Welcome';

import ViewPlaylist     from './View/Playlist';
import ViewEditPlaylist from './View/PlaylistEdit';
import ViewAddPlaylist  from './View/PlaylistAdd';


import ViewEditItem     from './View/ItemEdit';
import ViewAddItem      from './View/ItemAdd';

import ViewReleases     from './View/DiscoverReleases';

import ViewRelease      from './View/Release';
import ViewSearch       from './View/Search';
import ViewDiscover     from './View/DiscoverArtists';

import ViewNotFound     from './View/NotFound';
import Router           from '../Routing/Router.js';

import ShowRunner       from './ShowRunner';

import ModalAddToPlaylist from './Component/ModalAddToPlaylist';

class App extends CustomElement
{
    static elementName = 'the-app';

    __construct(api) 
    {
        this.api    = api;
        this.router = this.setUpRouter(api);
        this.showRunner = new ShowRunner(this, api);
    }

    render() 
    {
        this.$refs.middle = this.createAndAttach('div', {class: 'app-middle'}, [
            this.$refs.navMenu = NavMenu.instantiate(this.api),
            this.$refs.stage = this.create('div', {class: 'app-stage', id: 'stage'})
        ]);

        this.$refs.footer = this.createAndAttach('div', {class: 'app-footer'}, [
            this.$refs.controls = ReproductionControls.instantiate(this.api)
        ]);

        this.router.setStage(this.$refs.stage);
        this.router.listenToChanges();

        this.addEventListener('playlist-updated', () =>
        {
            this.$refs.navMenu.render();
        });

        this.addEventListener('item-to-add', (evt) => 
        {
            var modal = ModalAddToPlaylist.instantiate(this.api);
            this.append(modal);
        });

        this.classList.add('app');
    }

    playThis(item, resource) 
    {
        this.$refs.controls.destroy().remove();
        this.$refs.controls = ReproductionControls.instantiate(this.api, item, resource);
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
        .addRouter(/item:(?<itemUuid>[\w\d\-]+)\/edit/, function(request) 
        {
            return ViewEditItem.instantiate(request, api);
        })
        .addRouter(/playlist:(?<playlistId>[\w\d\-]+)\/create-item/, function(request) 
        {
            return ViewAddItem.instantiate(request, api);
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