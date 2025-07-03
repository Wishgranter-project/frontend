import CustomElement          from '../../CustomElement';
import AppNavigationMain      from './AppNavigationMain';
import AppNavigationPlaylists from './AppNavigationPlaylists';
import AppNavigationArtists   from './AppNavigationArtists';

/**
 * The app's main navigation.
 *
 * @class
 */
class AppNavigation extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'app-navigation';

    /**
     * Constructor.
     *
     * @param {Api} api
     * API to communicate with the back-end.
     */
    __construct(api) 
    {
        super.__construct();
        this.api = api;
    }

    /**
     * @inheritdoc
     */
    render() 
    {
        this.clear();
        this.classList.add('app-navigation');

        this.$refs.main      = AppNavigationMain.instantiate().attachTo(this);
        this.createAndAttach('hr');
        this.$refs.playlists = AppNavigationPlaylists.instantiate(this.api).attachTo(this);
        this.createAndAttach('hr');
        this.$refs.artists   = AppNavigationArtists.instantiate(this.api).attachTo(this);
    }

}

AppNavigation.register();

export default AppNavigation;
