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
    /** @inheritdoc */
    static elementName = 'app-navigation';

    /**
     * Constructor.
     *
     * @param {Api} api
     * Api to communicate with the backend.
     * @param {String} userId
     * The current user's id.
     */
    __construct(api, userId)
    {
        super.__construct();
        this.api = api;
        this.userId = userId;
    }

    /** @inheritdoc */
    render()
    {
        this.classList.add('app-navigation');

        this.attach([
            AppNavigationMain.instantiate(this.userId),
            AppNavigationPlaylists.instantiate(this.api, this.userId),
            this.create('hr'),
            AppNavigationArtists.instantiate(this.api, this.userId),
        ]);
    }

}

AppNavigation.register();

export default AppNavigation;
