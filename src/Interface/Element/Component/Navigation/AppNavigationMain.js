import CustomElement from '../../CustomElement';
import NavigationItem from './NavigationItem';

/**
 * Main navigation.
 *
 * @class
 */
class AppNavigationMain extends CustomElement
{
    /** @inheritdoc */
    static elementName = 'app-navigation-main';

    /**
     * Constructor.
     *
     * @param {String} userId
     * The current user's id.
     */
    __construct(userId)
    {
        super.__construct();
        this.userId = userId;
    }

    /** @inheritdoc */
    render()
    {
        this.attach([
            NavigationItem.instantiate('Home', 'fa-home', '#home', 'Homepage'),
            NavigationItem.instantiate('Search', 'fa-search', `#user:${this.userId}/search`, 'Search within your collection'),
            NavigationItem.instantiate('Discover', 'fa fa-search-plus', '#discover:artist', 'Discover new artists'),
        ]);
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
