import NavigationItem from './NavigationItem';

class NavigationItemPlaylist extends NavigationItem 
{
    static elementName = 'navigation-item-playlist';

    render()
    {
        super.render();
    }
}

NavigationItemPlaylist.register();

export default NavigationItemPlaylist;
