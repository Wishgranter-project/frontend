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
            this.$refs.content = this.create('div', {class: 'queue-display__content'}, 
                this.$refs.list = this.create('ol')
            )
        );
    }

    showQueue(ar) 
    {
        this.$refs.list.clear();
        for (var i of ar) {
            this.$refs.list.createAndAttach('li', null, i.title);
        }
    }
}

QueueDisplay.register();

export default QueueDisplay;