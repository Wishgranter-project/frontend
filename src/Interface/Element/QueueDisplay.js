import CustomElement from './CustomElement';
import PlaylistItem from './Component/PlaylistItem';

class QueueDisplay extends CustomElement 
{
    static elementName = 'queue-display';

    get isOpen() 
    {
        return this.classList.contains('is-open')
    }

    constructor() 
    {
        super();
    }

    open() 
    {
        this.classList.add('is-open');
    }

    close() 
    {
        this.classList.remove('is-open');
    }

    toggle() 
    {
        this.isOpen
            ? this.close()
            : this.open();
    }

    render() 
    {
        this.classList.add('queue-display');

        this.createAndAttach('div', {class: 'queue-display__drawer'}, 
            this.$refs.content = this.create('div', {class: 'queue-display__content'}, [
                    this.$refs.history = this.create('ol', {reversed: 'reversed'}),
                    this.create('hr'),
                    this.$refs.queued = this.create('ol')
                ]
            )
        );

        this.addEventListener('dragstart', (evt) => 
        {
            this.dragging = evt.target;
        });

        this.addEventListener('dragend', (evt) => 
        {
            this.dragging = null;
        });

        this.addEventListener('context-menu:actions:invite-alter', this.onContextMenuInviteAlter.bind(this));
    }

    onContextMenuInviteAlter(evt)
    {
        var el = evt.target;
        var index = el.parentNode.index();

        evt.detail.actions.removeFromQueue = {
            title: 'De-queue',
            helpText: 'Remove from queue',
            icon: 'fa-minus',
            onClick: () =>
            {
                this.queue.removeIndex(index);
            }
        };

        if (index > 1) {
            // Overwrites default action.
            evt.detail.actions.playNext = {
                title: 'Play next',
                helpText: 'Play once current song is finished',
                icon: 'fa-minus',
                onClick: () =>
                {
                    this.queue.move(index, 1);
                }
            };
        } else {
            // Deletes default action.
            delete evt.detail.actions.playNext;
        }
    }

    onDrop(evt)
    {
        var droppedLi   = this.dragging;
        var droppedOnLi = evt.target.getAncestor('li');

        var from = this.queue.getPosition(droppedLi.children[0].item);
        var to   = this.queue.getPosition(droppedOnLi.children[0].item);

        // Don't let drag the front of the queue. there are different ways.
        to = to == 0
            ? 1
            : to;

        if (from != to) {
            this.queue.move(from, to);
        }
    }

    refresh(queue, history) 
    {
        this.queue = queue;
        this.history = history;

        this.refreshQueue(queue);
        this.refreshHistory(history);
    }

    refreshHistory(history) 
    {
        var item;
        this.$refs.history.clear();

        for (var i = history.length -1; i >= 0; i--) {
            if (!history[i]) { continue; }
            item = PlaylistItem.instantiate(history[i]);
            this.$refs.history.createAndAttach('li', null, item);
        }
    }

    refreshQueue(queue)
    {
        var item, li, attributes;
        this.$refs.queued.clear();

        for (var i = 0; i < queue.length; i++) {
            if (!queue[i]) { continue; }
            item = PlaylistItem.instantiate(queue[i]);

            // Don't let drag the front of the queue. there are different ways.
            attributes = i > 0
                ? {'draggable': 'true'}
                : null;

            li = this.$refs.queued.createAndAttach('li', attributes, item)
            li.addEventListener('queue:item-selected', (evt) =>
            {
                evt.stopPropagation();
                var li = evt.target.parentNode;
                var from = [...this.$refs.queued.children].indexOf(li);

                if (from == 0) {
                    return;
                }

                this.fireEvent('queue:intention:jump', { from, to: 0 });
            });

            li.addEventListener('dragover', (evt) => { evt.preventDefault() });
            li.addEventListener('drop', this.onDrop.bind(this));
        }
    }
}

QueueDisplay.register();

export default QueueDisplay;