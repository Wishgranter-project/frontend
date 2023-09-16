import Queue from './Queue';

class ShowRunner 
{
    constructor(app, api) 
    {
        this.app = app;
        this.api = api;
        this.queue = new Queue();

        this.app.addEventListener('item-selected', this.onItemSelected.bind(this));
        this.app.addEventListener('player:ended', this.onPlayerEnded.bind(this));
    }

    onItemSelected(evt) 
    {
        this.findResourcesForMusicalItem(evt.detail.item).then( (response) =>
        {
            if (!response.data[0]) {
                alert('Nothing found to play');
                return;
            }
     
            if (evt.detail.context) {
                this.queue.setContext(evt.detail.context);
            }

            this.app.$refs.controls.playResource(response.data[0]);
        });
    }

    onPlayerEnded(evt) 
    {
        this.queue.dequeue();

        this.findResourcesForMusicalItem(this.queue.theOneInFront).then( (response) =>
        {
            if (response.data) {
                this.app.$refs.controls.playResource(response.data[0]);
            }
        });
    }

    async findResourcesForMusicalItem(item) 
    {
        var params = {}

        if (item.title) {
            params.title = item.title;
        }

        // Give preference for soundtracks.
        if (item.soundtrack) {
            params.soundtrack = item.soundtrack;
        } else if (item.artist) {
            params.artist = item.artist;
        }

        return this.api.discover.resources(params);
    }
}

export default ShowRunner;
