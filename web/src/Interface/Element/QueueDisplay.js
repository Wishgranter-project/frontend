import CustomElement from './CustomElement';

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
        this.$refs.history.clear();
        this.$refs.queued.clear();

        for (var i = history.length -1; i >= 0; i--) {
            this.$refs.history.createAndAttach('li', null, this.create('div', { class: 'ellipsis'}, history[i].title));
        }

        for (var i = 0; i < queue.length; i++) {
            this.$refs.queued.createAndAttach('li', null, this.create('div', { class: 'ellipsis'}, queue[i].title)).addEventListener('click', (evt) =>
            {
                var from = [...this.$refs.queued.children].indexOf(evt.target);
                this.fireEvent('queue:jump', { from, to: 0 });
            });
        }
    }
}

QueueDisplay.register();

export default QueueDisplay;