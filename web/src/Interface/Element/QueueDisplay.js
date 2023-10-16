import CustomElement from './CustomElement';
import PlaylistItem from './Component/PlaylistItem';

class QueueDisplay extends CustomElement 
{
    static elementName = 'queue-display';

    constructor() 
    {
        super();
        this.isOpen = false;
    }

    open() 
    {
        this.isOpen = true;
        this.classList.add('open');
    }

    close() 
    {
        this.isOpen = false;
        this.classList.remove('open');
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
            item = PlaylistItem.instantiate(history[i]);
            this.$refs.history.createAndAttach('li', null, item);
        }

        for (var i = 0; i < queue.length; i++) {
            item = PlaylistItem.instantiate(queue[i]);
            this.$refs.queued.createAndAttach('li', null, item).addEventListener('item-selected', (evt) =>
            {
                evt.stopPropagation();
                var li = evt.target.parentNode;
                var from = [...this.$refs.queued.children].indexOf(li);

                if (from == 0) {
                    return;
                }

                this.fireEvent('queue:jump', { from, to: 0 });
            });
        }
    }
}

QueueDisplay.register();

export default QueueDisplay;