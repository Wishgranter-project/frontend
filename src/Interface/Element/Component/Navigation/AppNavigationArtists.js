import CustomElement from '../../CustomElement';
import NavigationItemArtist from './NavigationItemArtist';

class AppNavigationArtists extends CustomElement 
{
    static elementName = 'app-navigation-artists';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.clear();
        this.classList.add('app-navigation__artists');

        this.api.collection.artists.list().then((response) => 
        {
            for (var artist in response.data) {
                this.addArtistNavItem(artist, response.data[artist]);
            }
        });
    }

    addArtistNavItem(artistName, count) 
    {
        var i = NavigationItemArtist.instantiate(artistName, null, '#search?artist=' + artistName, count);
        this.attach(i);
    }

}

AppNavigationArtists.register();

export default AppNavigationArtists;
