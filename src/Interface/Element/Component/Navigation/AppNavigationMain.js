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

        this.$refs.createPlaylist.addEventListener('click', () =>
        {
            this.fireEvent('playlist:intention:compose-new');
        });

        this.$refs.downloadPlaylists.addEventListener('click', () =>
        {
            this.fireEvent('collection:intention:download');
        });
    }
}

AppNavigationMain.register();

export default AppNavigationMain;
