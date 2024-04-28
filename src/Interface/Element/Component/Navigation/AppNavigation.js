import CustomElement from '../../CustomElement';
import AppNavigationMain from './AppNavigationMain';
import AppNavigationPlaylists from './AppNavigationPlaylists';
import AppNavigationArtists from './AppNavigationArtists';

class AppNavigation extends CustomElement 
{
    static elementName = 'app-navigation';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.clear();
        this.classList.add('app-navigation');

        this.$refs.main      = AppNavigationMain.instantiate(this.api);
        this.$refs.playlists = AppNavigationPlaylists.instantiate(this.api);
        this.$refs.artists   = AppNavigationArtists.instantiate(this.api);

        this.attach(this.$refs.main);
        this.createAndAttach('hr');
        this.attach(this.$refs.playlists);
        this.createAndAttach('hr');
        this.attach(this.$refs.artists);
    }

}

AppNavigation.register();

export default AppNavigation;
