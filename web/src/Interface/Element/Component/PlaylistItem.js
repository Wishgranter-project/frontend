import CustomElement from '../CustomElement';
import PopupMenu from './PopupMenu/PopupMenu';
import PopupButton from './PopupMenu/PopupButton';

class PlaylistItem extends CustomElement 
{
    static elementName = 'playlist-item';

    __construct(item = {}, options = {}) 
    {
        this.item = item;
        this.options = options;

        if (!this.item.artist) {
            this.item.artist = [];
        } else {
            this.item.artist = Array.isArray(this.item.artist)
                ? this.item.artist
                : [this.item.artist];
        }

        if (!this.item.soundtrack) {
            this.item.soundtrack = [];
        } else {
            this.item.soundtrack = Array.isArray(this.item.soundtrack)
                ? this.item.soundtrack
                : [this.item.soundtrack];
        }
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
            this.fireEvent('item-selected', {
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
                this.create('a', {href: `#search?artist=${artist}` }, artist), 
                ' ',
                this.create('a', {href: `#discover:releases?artist=${artist}`}, this.createAndAttach('span', {class: 'fa fa-search'}))
            ]);
        }

        for (var soundtrack of this.item.soundtrack) {
            this.$refs.body.createAndAttach('span', {class: 'playlist-item__soundtrack playlist-item__info'}, [ 
                this.create('a', {href: `#search?soundtrack=${soundtrack}` }, soundtrack)
            ]);
        }
    }

    subRenderFooter() 
    {
        this.$refs.footer = this.createAndAttach('div', {class: 'playlist-item__footer'});

        var actions = [];

        actions.push({
            title: 'Add to playlist',
            helpText: 'choose a playlist',
            icon: 'fa-plus',
            onClick: () => 
            {
                this.fireEvent('item-to-add', {
                    items: [ this.item ]
                });
            }
        });

        if (this.item.uuid) {
            actions.push({
                title: 'Edit item',
                helpText: '',
                icon: 'fa-pencil',
                onClick: () => 
                {
                    this.fireEvent('edit-item', {uuid: this.item.uuid})
                }
            });

            actions.push({
                title: 'Remove item',
                helpText: '',
                icon: 'fa-times',
                onClick: () => 
                {
                    this.fireEvent('delete-item', {uuid: this.item.uuid});
                }
            });
        }

        this.$refs.popupButton = this.$refs.footer.attach(PopupButton.instantiate(actions));
    }
}

PlaylistItem.register();

export default PlaylistItem;
