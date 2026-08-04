import CustomElement          from '../../CustomElement';
import AppNavigationMain      from './AppNavigationMain';
import AppNavigationPlaylists from './AppNavigationPlaylists';
import SmartScroll            from '../SmartScroll';

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

        const browser = SmartScroll.instantiate();
        browser.classList.add('app-navigation__browser');
        browser.append(AppNavigationPlaylists.instantiate(this.api));

        this.attach([
            AppNavigationMain.instantiate(this.api),
            browser,
        ]);
    }

}

AppNavigation.register();

export default AppNavigation;
