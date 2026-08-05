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
        this.classList.add('app-navigation__main');

        this.createAndAttach('a', {href: '#home', title: 'Homepage', class: 'btn'}, this.create('span', {class: 'fa fa-home'}));
        this.createAndAttach('a', {href: `#user:${this.api.defaultUserId}/search`, title: 'Search', class: 'btn'}, this.create('span', {class: 'fa fa-search'}));
        this.createAndAttach('a', {href: '#discover:artist', title: 'Discover', class: 'btn'}, this.create('span', {class: 'fa fa-search-plus'}));

        this.$refs.createPlaylist    = this.createAndAttach('button', {title: 'Create playlist'}, this.create('span', {class: 'fa fa-plus-circle'}));
        this.$refs.downloadPlaylists = this.createAndAttach('button', {title: 'Download entire collection'}, this.create('span', {class: 'fa fa-download'}));

        //this.attach([
        //    NavigationItem.instantiate('Home', '#home', 'Homepage', null, 'fa-home'),
        //    NavigationItem.instantiate('Search', `#user:${this.api.defaultUserId}/search`, 'Search within your collection', null, 'fa-search'),
        //    NavigationItem.instantiate('Discover', '#discover:artist', 'Discover new artists', null, 'fa fa-search-plus'),
        //]);
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
