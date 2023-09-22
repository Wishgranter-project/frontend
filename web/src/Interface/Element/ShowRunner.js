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
        this.app.addEventListener('controls:forward', this.jumpTheQueue.bind(this));
    }

    onItemSelected(evt) 
    {
        var {item, context} = evt.detail;

        console.log('Show runner: New item selected');
        this.findResourcesForMusicalItem(item).then( (response) =>
        {
            if (!response.data[0]) {
                alert('Show runner: Nothing found to play');
                return;
            }

            this.app.playThis(item, response.data[0]);
        });

        if (context) {
            this.queue.setContext(context);
            this.app.$refs.queueDisplay.showQueue(this.queue);
            if (this.queue.length <= 1) {
                this.queue.fetchMore();
            }
        }
    }

    onPlayerEnded(evt) 
    {
        this.advanceTheQueue();
    }

    jumpTheQueue(evt) 
    {
        this.advanceTheQueue();
    }

    advanceTheQueue() 
    {
        this.queue.dequeue();

        if (!this.queue.theOneInFront) {
            return;
        }

        this.findResourcesForMusicalItem(this.queue.theOneInFront).then( (response) =>
        {
            if (!response.data[0]) {
                alert('Show runner: Nothing found to play');
                return;
            }

            if (this.queue.length <= 1) {
                this.queue.fetchMore();
            }

            this.app.playThis(this.queue.theOneInFront, response.data[0]);
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
