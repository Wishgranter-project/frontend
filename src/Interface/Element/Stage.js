import TabManager, { 
    TabPanel,
    TabButton,
    TabsBar,
    TabControls,
    RouteCollection,
    HashRequest,
} from 'tabbed-router';

import ViewWelcome    from './View/ViewWelcome';
import ViewPlaylist   from './View/ViewPlaylist';
import ViewAlbums     from './View/ViewDiscoverAlbums';
import ViewSearch     from './View/ViewSearch';
import ViewDiscover   from './View/ViewDiscoverArtists';
import Serialization  from '../../Helper/Serialization';
import Instantiator   from '../../Helper/Instantiator';
import State          from '../../State/State';

class Stage extends TabManager
{
    /**
     * Constructor.
     */
    constructor()
    {
        super();
        this.state = new State('state.navigation');
    }

    /** @inheritdoc */
    render()
    {
        super.render();
        this.classList.add('app__stage');
        this.setAttribute('id', 'stage');

        this.addEventListeners({
            'tabbed-router:tab-panel-updated':   this.onNavigationUpdate.bind(this),
            'tabbed-router:tab-panel-reordered': this.onNavigationUpdate.bind(this),
            'tabbed-router:tab-panel-closed':    this.onNavigationUpdate.bind(this),
        });
    }

    instantiateRouteCollection(api)
    {
        this.routeCollection = new RouteCollection();

        this.routeCollection
        .createRoute([/^$/, /home$/], function(request)
        {
            return ViewWelcome.instantiate(request, api);
        })
        .createRoute(/user:(?<userId>[\w\d\-]+)\/playlist:(?<playlistId>[\w\d\-]+)$/, function(request) 
        {
            return ViewPlaylist.instantiate(request, api);
        })
        .createRoute(/user:(?<userId>[\w\d\-]+)\/search/, function(request) 
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
    }

    /**
     * Loads tabs from memory and restores them.
     *
     * @returns {Int}
     * The number of tabs opened.
     */
    restoreTabs()
    {
        var requests = this.loadTabs();
        var focus = false;
        var n = 0;
        for (var r of requests) {
            focus = n == requests.length -1;
            this.openInNewTabPanel(r, focus);
            n++;
        }

        return requests.length;
    }

    /**
     * Opens the homepage in a new tab.
     */
    openHomePage()
    {
        const mainTab = this.addNewTabPanel('main-tab', true);
        mainTab.access('#home');
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * @param {Event} evt
     * Event to react to.
     */
    onNavigationUpdate(evt)
    {
        this.saveTabs();
    }

    /**
     * Commits tabs to memory.
     *
     * @protected
     */
    saveTabs()
    {
        var requests = [];

        for (var tab of this.$refs.tabPanelsWrapper.children) {
            var request = tab.childNodes[0] && tab.childNodes[0].request
                ? tab.childNodes[0].request
                : null;

            if (request) {
                requests.push(Serialization.serialize(request));
            }
        }
        
        this.state.set('requests', requests);
    }

    /**
     * Loads tabs from mermory.
     *
     * @protected
     *
     * @returns {Array}
     * Of requests to open as tabs.
     */
    loadTabs()
    {
        var serializedRequests = this.state.get('requests', []);
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

customElements.define('tab-manager',  Stage);
customElements.define('tab-panel',    TabPanel);
customElements.define('tab-link',     TabButton);
customElements.define('tab-links',    TabsBar);
customElements.define('tab-controls', TabControls);

export default Stage;
