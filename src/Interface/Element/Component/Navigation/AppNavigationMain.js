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
        this.attach(NavigationItem.instantiate('Home', 'fa-home', '#home'));
        this.attach(NavigationItem.instantiate('Search', 'fa-search', '#search'));
        this.attach(NavigationItem.instantiate('Discover', 'fa fa-search-plus', '#discover:artist'));
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
