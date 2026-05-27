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
     * @param {Collection} collection
     * The user's collection.
     */
    __construct(collection)
    {
        super.__construct();
        this.collection = collection;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.clear();
        this.classList.add('app-navigation');

        this.$refs.main      = AppNavigationMain.instantiate().attachTo(this);
        this.$refs.playlists = AppNavigationPlaylists.instantiate(this.collection).attachTo(this);
        this.createAndAttach('hr');
        this.$refs.artists   = AppNavigationArtists.instantiate(this.collection).attachTo(this);
    }

}

AppNavigation.register();

export default AppNavigation;
