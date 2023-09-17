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
        console.log('Show runner: New item selected');
        this.findResourcesForMusicalItem(evt.detail.item).then( (response) =>
        {
            if (!response.data[0]) {
                alert('Show runner: Nothing found to play');
                return;
            }
     
            if (evt.detail.context) {
                this.queue.setContext(evt.detail.context);
                if (this.queue.length <= 1) {
                    this.queue.fetchMore();
                }
            }

            this.app.$refs.controls.playResource(response.data[0]);
        });
    }

    onPlayerEnded(evt) 
    {
        this.queue.dequeue();

        if (!this.queue.theOneInFront) {
            return;
        }

        console.log('Show runner: moving the queue');
        this.findResourcesForMusicalItem(this.queue.theOneInFront).then( (response) =>
        {
            if (response.data) {
                this.app.$refs.controls.playResource(response.data[0]);
            }
        });
    }

    async findResourcesForMusicalItem(item) 
    {
        console.log('Show runner: searching for source to play');

        var params = {}

        if (item.title) {
            params.title = item.title;
        }

        // Give preference for soundtracks.
        if (item.soundtrack && item.soundtrack.length) {
            params.soundtrack = item.soundtrack;
        } else if (item.artist && item.artist.length) {
            params.artist = item.artist;
        }

        return this.api.discover.resources(params);
    }
}

export default ShowRunner;
