import CustomElement from '../CustomElement';

/**
 * An element to display status messages to the user.
 */
class Messages extends CustomElement
{
    /**
     * {@inheritdoc}
     */
    static elementName = 'messages-container';

    /**
     * {@inheritdoc}
     */
    render()
    {
        this.classList.add('messages');
        this.success = this.createAndAttach('ul', {class: 'successes hidden'});
        this.warning = this.createAndAttach('ul', {class: 'warnings hidden'});
        this.error = this.createAndAttach('ul', {class: 'errors hidden'});
    }

    /**
     * Set messages to be displayed.
     *
     * @param {Array} messages
     * List of messages.
     */
    messages(messages)
    {
        this.success.clear().classList.add('hidden');
        this.warning.clear().classList.add('hidden');
        this.error.clear().classList.add('hidden');

        for (var message of messages) {
            this[message.type].classList.remove('hidden');
            this[message.type].createAndAttach('li', null, message.title);
        }

    }
}

Messages.register();

export default Messages;
