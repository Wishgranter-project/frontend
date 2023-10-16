import Queue from '../../Queue/Queue';
import History from '../../Queue/History';

class ShowRunner 
{
    constructor(app, api, queue = null, history = null) 
    {
        this.app     = app;
        this.api     = api;
        this.history = history ? history : (new History());
        this.setQueue(queue ? queue : (new Queue()));

        this.app.addEventListener('item-selected', this.onItemSelected.bind(this));
        this.app.addEventListener('player:ended', this.onPlayerEnded.bind(this));
        this.app.addEventListener('controls:forward', this.forwardTheQueue.bind(this));
        this.app.addEventListener('controls:backward', this.rewindTheQueue.bind(this));
        this.app.addEventListener('queue:jump', this.onJumpLine.bind(this));
    }

    async onJumpLine(evt) 
    {
        var { from, to } = evt.detail;
        var target = this.queue.move(from, to);

        if (to == 0) {
            this.playItem(target);
        }
    }

    async onItemSelected(evt) 
    {
        var { item, queue } = evt.detail;

        console.log('-------------------------------');
        console.log('Show runner: New item selected');

        return queue
            ? this.playNewQueue(queue)
            : this.jumpTheQueue(item);
    }

    /**
     * Keeps queue, but jump item to the front of it.
     */
    async jumpTheQueue(item) 
    {
        this.queue.dropIn(item);
        // add previous to history etc
        return this.playItem(item);
    }

    /**
     * Clears old queue, set this new one up.
     */
    async playNewQueue(queue) 
    {
        var oldQueue = this.queue;

        if (oldQueue.front) {
            this.addToHistory(oldQueue.front);
        }

        this.setQueue(queue);

        return this.playItem(this.queue.front);
    }

    setQueue(queue) 
    {
        this.queue = queue;
        this.queue.updatedCallback = () =>
        {
            if (this.app.$refs.queueDisplay) {
                this.app.$refs.queueDisplay.showQueue(this.queue, this.history);
            }
        }
        this.queue.updatedCallback();
    }

    async onPlayerEnded(evt) 
    {
        console.log('-------------------------------');
        console.log('Show runner: song ended, next.');
        return this.advanceTheQueue();
    }

    async rewindTheQueue(evt) 
    {
        if (! this.history.length) {
            return;
        }

        console.log('-------------------------------');
        console.log('Show runner: rewinding queue.');

        var previous = this.history.rewind(1)[0];
        this.queue.dropIn(previous);

        return this.playItem(previous);
    }

    async forwardTheQueue(evt) 
    {
        console.log('-------------------------------');
        console.log('Show runner: song skipped, next.');
        return this.advanceTheQueue();
    }

    async advanceTheQueue() 
    {
        return this.queue.getNextInLine().then( (next) => 
        {
            this.addToHistory(this.queue.front);
            this.queue.dequeue();

            if (next) {
                return this.playItem(next);
            } else {
                console.log('Showrunner: Nothing else to play');
            }
        });
    }

    addToHistory(item) 
    {
        this.history.add(item);
    }

    async playItem(item) 
    {
        return this.findResourcesForMusicalItem(item).then( (response) =>
        {
            if (!response.data.length) {
                alert('Show runner: Nothing found to play');
                return;
            }

            this.app.playItem(item, response.data);
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
