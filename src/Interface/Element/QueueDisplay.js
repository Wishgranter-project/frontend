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
    }

    showQueue(queue, history) 
    {
        var item;
        this.$refs.history.clear();
        this.$refs.queued.clear();

        for (var i = history.length -1; i >= 0; i--) {
            if (!history[i]) { continue; }
            item = PlaylistItem.instantiate(history[i]);
            this.$refs.history.createAndAttach('li', null, item);
        }

        for (var i = 0; i < queue.length; i++) {
            if (!queue[i]) { continue; }
            item = PlaylistItem.instantiate(queue[i]);
            this.addContextMenuItems(item, queue, i);
            this.$refs.queued.createAndAttach('li', null, item).addEventListener('queue:item-selected', (evt) =>
            {
                evt.stopPropagation();
                var li = evt.target.parentNode;
                var from = [...this.$refs.queued.children].indexOf(li);

                if (from == 0) {
                    return;
                }

                this.fireEvent('queue:intention:jump', { from, to: 0 });
            });
        }
    }

    addContextMenuItems(item, queue, i) 
    {
        item.actions.removeFromQueue = {
            title: 'Remove from queue',
            helpText: 'remove',
            icon: 'fa-minus',
            onClick: () =>
            {
                queue.removeIndex(i);
            }
        };

        if (i > 1) {
            item.actions.playNext = {
                title: 'Play next',
                helpText: 'play next',
                icon: 'fa-minus',
                onClick: () =>
                {
                    queue.move(i, 1);
                }
            };
        }
    }
}

QueueDisplay.register();

export default QueueDisplay;