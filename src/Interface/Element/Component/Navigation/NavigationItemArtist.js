import NavigationItem from './NavigationItem';

class NavigationItemArtist extends NavigationItem 
{
    static elementName = 'navigation-item-artist';

    __construct(label, icon, href, count)
    {
        super.__construct(label, icon, href);
        this.count = count;
    }

    render()
    {
        super.render();
        this.$refs.a.createAndAttach('span', {class: 'badge'}, this.count);
    }
}

NavigationItemArtist.register();

export default NavigationItemArtist;
