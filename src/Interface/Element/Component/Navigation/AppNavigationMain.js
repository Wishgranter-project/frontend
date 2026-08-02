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
     * The API.
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
            NavigationItem.instantiate('Home', 'fa-home', '#home', 'Homepage'),
            NavigationItem.instantiate('Search', 'fa-search', `#user:${this.api.defaultUserId}/search`, 'Search within your collection'),
            NavigationItem.instantiate('Discover', 'fa fa-search-plus', '#discover:artist', 'Discover new artists'),
        ]);
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
