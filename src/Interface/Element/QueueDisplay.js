import CustomElement from './CustomElement';
import ListOfItems from './Component/ListOfItems';

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
                    this.$refs.hr = this.create('hr'),
                ]
            )
        );

        this.addEventListener('list-of-items:reordered', this.onEqueueReordered.bind(this));

        this.subRenderHistory();
        this.subRenderQueue();
    }

    subRenderHistory()
    {
        this.$refs.history = ListOfItems.instantiate([]);
        this.$refs.hr.before(this.$refs.history);
    }

    subRenderQueue()
    {
        this.$refs.queued = ListOfItems.instantiate([]);
        this.$refs.queued.setAttribute('reordable', true);
        this.$refs.queued.dropIsValid = function(dropEvt) {
            var draggingLocalElements = this.draggingElement;
            if (!draggingLocalElements) {
                return true;
            }

            // Don't move items in place of the front queue.
            var droppedOn = dropEvt.target.getAncestor('li');
            if (droppedOn.index() == 0) {
                return false;
            }

            // Don't move the front queue away.
            var selectedElements = this.getSelectedElements();
            var indexes = this.extractIndexes(selectedElements);
            if (indexes.includes(0)) {
                return false;
            }

            return true;
        }
        this.$refs.queued.addEventListener('context-menu:actions:invite-alter', this.onContextMenuInviteAlter.bind(this));
        this.$refs.queued.addEventListener('queue:item-selected', this.onQueueItemSelected.bind(this));
        this.$refs.hr.after(this.$refs.queued);
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

    refresh(queue, history)
    {
        this.queue = queue;
        this.history = history;

        this.refreshQueue(queue);
        this.refreshHistory(history);
    }

    refreshHistory(ar)
    {
        this.$refs.history.setItems(ar.slice().reverse());
    }

    refreshQueue(ar)
    {
        this.$refs.queued.setItems(ar);
    }

    onEqueueReordered(evt)
    {
        var changes = evt.detail.changes;
        for (var change of changes) {
            this.queue.move(change.from, change.to);
        }
    }

    onQueueItemSelected(evt)
    {
        var target = evt.target;
        var index = target.parentNode.index();

        if (index == 0) {
            // do nothing.
            evt.stopPropagation();
            return;
        }

        // Remove, code in the App.js will add it back at the begining of the queue.
        this.queue.removeIndex(index);
    }
}

QueueDisplay.register();

export default QueueDisplay;