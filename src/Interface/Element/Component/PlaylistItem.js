import ContextualElement from './ContextualElement';

/**
 * Represents a playlist item.
 *
 * A playlist or an album.
 *
 * @class
 */
class PlaylistItem extends ContextualElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'playlist-item';

    /**
     * Constructor.
     *
     * @param {Object} item
     * The item, artist, title etc.
     * @param {Object} options
     * Options regarding how to render the element.
     */
    __construct(item = {}, options = {})
    {
        super.__construct();
        PlaylistItem.sanitizeItem(item);
        this.item    = item;
        this.options = options;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        super.render();
        this.innerHTML = ``;
        this.classList.add('playlist-item');

        this.subRenderHeader();
        this.subRenderBody();
        this.subRenderFooter();        
    }

    /**
     * Renders the play button.
     */
    subRenderHeader()
    {
        if (this.options.disablePlayButton) {
            return;
        }

        this.$refs.header = this.createAndAttach('div', {class: 'playlist-item__header'}, [
            this.$refs.playButton = this.create('button', null, this.createAndAttach('span', {class: 'fa fa-play'}))
        ]);

        this.$refs.playButton.addEventListener('click', () => 
        {
            this.fireEvent('queue:item-selected', {
                item: this.item
            });
        });
    }

    /**
     * Renders the title, artist name and links.
     */
    subRenderBody()
    {
        this.$refs.body = this.createAndAttach('div', {class: 'playlist-item__body'});

        if (this.item.title || this.item.album) {
            this.$refs.title = this.$refs.body.createAndAttach('span', {class: 'playlist-item__title'}, [ (this.item.title || this.item.album) ]);
        }

        for (var artist of this.item.artist) {
            this.$refs.body.createAndAttach('span', {class: 'playlist-item__artist playlist-item__info'}, [ 
                this.create('a', {href: `#search?artist=${artist}`, title: artist }, artist), 
                ' ',
                this.create('a', {href: `#discover:albums?artist=${artist}`, title: `${artist}`}, this.createAndAttach('span', {class: 'fa fa-search'}))
            ]);
        }

        for (var soundtrack of this.item.soundtrack) {
            this.$refs.body.createAndAttach('span', {class: 'playlist-item__soundtrack playlist-item__info'}, [ 
                this.create('a', {href: `#search?soundtrack=${soundtrack}`, title: soundtrack }, soundtrack)
            ]);
        }
    }

    /**
     * Renders the button to open the context menu.
     */
    subRenderFooter()
    {
        this.$refs.footer = this.createAndAttach('div', {class: 'playlist-item__footer'});

        this.$refs.popupButton = this.$refs.footer.createAndAttach('button', null, this.create('span', { class: 'fa fa-ellipsis-v' }));
        this.$refs.popupButton.addEventListener('click', (evt) => 
        {
            evt.stopPropagation();
            this.openContextMenu(evt)
        });
    }

    /**
     * @inheritdoc
     */
    getDefaultContextActions()
    {
        var actions = {
            addToPlaylist: {
                title: 'Save to collection',
                helpText: 'Add item to a playlist',
                icon: 'fa-plus',
                onClick: () => 
                {
                    this.fireEvent('item:intention:add-to-collection', {
                        items: [ this.item ]
                    });
                }
            }
        }

        actions.playNext = {
            title: 'Play next',
            helpText: 'Play once the current song is finished',
            icon: 'fa-minus',
            onClick: () =>
            {
                this.fireEvent('queue:intention:play-it-next', {item: this.item});
            }
        };

        if (!this.item.uuid) {
            return actions;
        }

        actions.editItem = {
            title: 'Edit it',
            helpText: 'Edit item in your collection',
            icon: 'fa-pencil',
            onClick: () => 
            {
                this.fireEvent('item:intention:edit', {uuid: this.item.uuid})
            }
        };

        actions.removeItem = {
            title: 'Delete item',
            helpText: 'Delete item from your collection',
            icon: 'fa-times',
            onClick: () => 
            {
                this.fireEvent('item:intention:delete', {uuid: this.item.uuid});
            }
        };

        return actions;
    }

    /**
     * Normalizes an item.
     *
     * @param {Object} item
     * item of a playlist item.
     */
    static sanitizeItem(item) {
        if (!item.artist) {
            item.artist = [];
        } else {
            item.artist = Array.isArray(item.artist)
                ? item.artist
                : [item.artist];
        }

        if (!item.soundtrack) {
            item.soundtrack = [];
        } else {
            item.soundtrack = Array.isArray(item.soundtrack)
                ? item.soundtrack
                : [item.soundtrack];
        }
    }
}

PlaylistItem.register();

export default PlaylistItem;
