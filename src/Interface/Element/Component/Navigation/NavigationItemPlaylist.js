import NavigationItem from './NavigationItem';

class NavigationItemPlaylist extends NavigationItem 
{
    static elementName = 'navigation-item-playlist';

    __construct(label, icon, href, playlistId, api)
    {
        super.__construct(label, icon, href);
        this.playlistId = playlistId;
        this.api        = api;
    }

    render()
    {
        super.render();
        this.addEventListener('drop', this.onDrop.bind(this));
        this.addEventListener('dragover', this.onDragOver.bind(this));
    }

    onDragOver(evt)
    {
        evt.preventDefault();
    }

    onDrop(evt)
    {
        var json = evt.dataTransfer.getData('text');
        var data = JSON.parse(json);

        this.api.collection.playlistItems.addMultiple(data, this.playlistId).then(() =>
        {
            alert('Item(s) added!!');
        });
    }
}

NavigationItemPlaylist.register();

export default NavigationItemPlaylist;
