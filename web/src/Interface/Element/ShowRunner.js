import Queue from '../../Queue/Queue';

class ShowRunner 
{
    constructor(app, api, queue = null) 
    {
        this.app   = app;
        this.api   = api;
        this.queue = queue ? queue : (new Queue());

        this.app.addEventListener('item-selected', this.onItemSelected.bind(this));
        this.app.addEventListener('player:ended', this.onPlayerEnded.bind(this));
        this.app.addEventListener('controls:forward', this.jumpTheQueue.bind(this));
    }

    async onItemSelected(evt) 
    {
        var { item, queue } = evt.detail;

        console.log('Show runner: New item selected');

        return queue
            ? this.playNewQueue(queue)
            : this.playItem(item);
    }

    async playNewItem(item) 
    {
        // add previous to history etc
        return this.playItem(item);
    }

    async playNewQueue(queue) 
    {
        var oldQueue = this.queue;
        if (oldQueue.theOneInFront) {
            this.addToHistory(oldQueue.theOneInFront);
        }

        this.queue = queue;
        this.app.$refs.queueDisplay.showQueue(this.queue);
        this.queue.updatedCallback = () =>
        {
            this.app.$refs.queueDisplay.showQueue(this.queue);
        }

        return this.playItem(this.queue.theOneInFront);
    }

    async onPlayerEnded(evt) 
    {
        return this.advanceTheQueue();
    }

    async jumpTheQueue(evt) 
    {
        return this.advanceTheQueue();
    }

    async advanceTheQueue() 
    {
        return this.queue.advance().then( (previous) => 
        {
            this.addToHistory(previous);

            if (this.queue.length) {
                return this.playItem(this.queue.theOneInFront);
            }
        });
    }

    addToHistory() 
    {

    }

    async playItem(item) 
    {
        return this.findResourcesForMusicalItem(item).then( (response) =>
        {
            if (!response.data[0]) {
                alert('Show runner: Nothing found to play');
                return;
            }

            this.app.playResource(item, response.data[0]);
            return response;
        });
    }

    /**
     * Finds resources for item to be played
     *
     * @param object item
     *   The item describing the song.
     *
     * @return Promise 
     */
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
