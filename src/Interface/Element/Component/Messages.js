import CustomElement from '../CustomElement';

/**
 * An element to display status messages to the user.
 */
class Messages extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'messages-container';

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('messages');
        this.successes = this.createAndAttach('ul', {class: 'successes hidden'});
        this.warnings = this.createAndAttach('ul', {class: 'warnings hidden'});
        this.errors = this.createAndAttach('ul', {class: 'errors hidden'});
    }

    /**
     * Set messages to be displayed.
     *
     * @param {Object} messages
     * List of messages.
     */
    messages(messages)
    {
        this.successes.clear().classList.add('hidden');
        this.warnings.clear().classList.add('hidden');
        this.errors.clear().classList.add('hidden');

        if (messages.successes) {
            this.successes.classList.remove('hidden');
            for (var m of messages.successes) {
                this.successes.createAndAttach('li', null, m.title);
            }
        }

        if (messages.errors) {
            this.errors.classList.remove('hidden');
            for (var m of messages.errors) {
                this.errors.createAndAttach('li', null, m.title);
            }
        }

        if (messages.warnings) {
            this.warnings.classList.remove('hidden');
            for (var m of messages.warnings) {
                this.warnings.createAndAttach('li', null, m.title);
            }
        }
    }
}

Messages.register();

export default Messages;
