import CustomElement          from '../../CustomElement';
import AppNavigationMain      from './AppNavigationMain';
import AppNavigationPlaylists from './AppNavigationPlaylists';

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
     * Api to communicate with the backend.
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
        this.classList.add('app-navigation');

        this.attach([
            AppNavigationMain.instantiate(this.api),
            this.create('div', {class: 'app-navigation__browser'}, 
                AppNavigationPlaylists.instantiate(this.api)
            ),
        ]);
    }

}

AppNavigation.register();

export default AppNavigation;
