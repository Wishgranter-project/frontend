import CustomElement from '../CustomElement';
//import PopupButton from './PopupMenu/PopupButton';
import FloatMenu from './FloatMenu/FloatMenu';

class PlaylistItem extends CustomElement 
{
    static elementName = 'playlist-item';

    __construct(item = {}, options = {}) 
    {
        PlaylistItem.sanitizeItem(item);
        this.item    = item;
        this.options = options;
        this.actions = this.getContextActions();
    }

    render() 
    {
        this.innerHTML = ``;
        this.classList.add('playlist-item');

        this.subRenderHeader();
        this.subRenderBody();
        this.subRenderFooter();        
    }

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

    subRenderBody() 
    {
        this.$refs.body   = this.createAndAttach('div', {class: 'playlist-item__body'});

        if (this.item.title) {
            this.$refs.title = this.$refs.body.createAndAttach('span', {class: 'playlist-item__title'}, [ this.item.title ]);
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

    subRenderFooter() 
    {
        this.$refs.footer = this.createAndAttach('div', {class: 'playlist-item__footer'});       

        this.addEventListener('contextmenu', (evt) => 
        {
            evt.preventDefault();
            this.openContextMenu(evt);
        });

        this.$refs.popupButton = this.$refs.footer.createAndAttach('button', null, this.create('span', { class: 'fa fa-ellipsis-v' }));
        this.$refs.popupButton.addEventListener('click', (evt) => 
        {
            evt.stopPropagation();
            this.openContextMenu(evt)
        });
    }

    getContextActions() 
    {
        var actions = {
            addToPlaylist: {
                title: 'Add to playlist',
                helpText: 'choose a playlist',
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
            helpText: 'play next',
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
            title: 'Edit item',
            helpText: '',
            icon: 'fa-pencil',
            onClick: () => 
            {
                this.fireEvent('item:intention:edit', {uuid: this.item.uuid})
            }
        };

        actions.removeItem = {
            title: 'Remove item',
            helpText: '',
            icon: 'fa-times',
            onClick: () => 
            {
                this.fireEvent('item:intention:delete', {uuid: this.item.uuid});
            }
        };

        return actions;
    }

    openContextMenu(evt) 
    {
        var menu = FloatMenu.instantiate(this.actions);
        this.append(menu);
        menu.open(evt, evt.clientX, evt.clientY);
    }

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
