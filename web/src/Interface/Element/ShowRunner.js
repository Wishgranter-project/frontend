class ShowRunner 
{
    constructor(app, api) 
    {
        this.app = app;
        this.api = api;
        // this.queue = new Queue();

        this.app.addEventListener('item-selected', this.onItemSelected.bind(this));
    }

    onItemSelected(evt) 
    {
        this.findResourcesForMusicalItem(evt.detail.item).then( (response) =>
        {
            if (response.data[0]) {
                this.app.$refs.controls.playResource(response.data[0]);
            } else {
                alert('Nothing found to play');
            }
        });
    }

    async findResourcesForMusicalItem(item) 
    {
        var params = {}

        if (item.title) {
            params.title = item.title;
        }

        if (item.soundtrack) {
            params.soundtrack = item.soundtrack;
        } else if (item.artist) {
            params.artist = item.artist;
        }

        return this.api.discover.resources(params);
    }
}

export default ShowRunner;
