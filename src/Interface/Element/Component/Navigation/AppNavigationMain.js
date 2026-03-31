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
     * @inheritdoc
     */
    render()
    {
        this.clear();
        this.attach(NavigationItem.instantiate('Home', 'fa-home', '#home', 'Homepage'));
        this.attach(NavigationItem.instantiate('Search', 'fa-search', '#search', 'Search within your collection'));
        this.attach(NavigationItem.instantiate('Discover', 'fa fa-search-plus', '#discover:artist', 'Discover new artists'));
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
