import CustomElement from '../../CustomElement';
import NavigationItem from './NavigationItem';

/**
 * Main navigation.
 *
 * @class
 */
class AppNavigationMain extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'app-navigation-main';

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
        this.attach([
            NavigationItem.instantiate('Home', '#home', 'Homepage', null, 'fa-home'),
            NavigationItem.instantiate('Search', `#user:${this.api.defaultUserId}/search`, 'Search within your collection', null, 'fa-search'),
            NavigationItem.instantiate('Discover', '#discover:artist', 'Discover new artists', null, 'fa fa-search-plus'),
        ]);
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
