import ContextualElement from './ContextualElement';

/**
 * Discography item represents an item in an artist's discography.
 * Be it a full featured album or a single.
 */
class DiscographyItem extends ContextualElement 
{
    static elementName = 'discography-item';

    __construct(album) 
    {
        this.album = album;
        super.__construct();
    }

    render()
    {
        super.render();
        this.classList.add('card');
        this.classList.add('discography-item');

        var attributes = {
            title: this.album.artist + ' - ' + this.album.title
        }

        this.album.single
            ? this.subRenderSingle(attributes)
            : this.subRenderAlbum(attributes);
    }

    subRenderSingle(attributes)
    {
        this.subRenderCore('span', attributes);
        this.$refs.title.createAndAttach('span', {class: 'fa fa-hand-pointer-o'});

        this.subRenderPlayButton().addEventListener('click', () => 
        {
            this.fireEvent('queue:item-selected', {
                item: {
                    title: this.album.title,
                    artist: this.album.artist
                }
            });
        });
    }

    subRenderAlbum(attributes)
    {
        attributes.href = `#discover:album?artist=${this.album.artist}&title=${this.album.title}`;
        this.subRenderCore('a', attributes);

        this.subRenderPlayButton().addEventListener('click', () => 
        {
            this.fireEvent('queue:item-selected', {
                item: {
                    album: this.album.title,
                    artist: this.album.artist
                }
            });
        });
    }

    //-----------------------------------------

    subRenderPlayButton()
    {
        return this.$refs.playButton = this.createAndAttach('button', {}, this.create('span', {class: 'fa fa-play'}));
    }

    subRenderCore(coreElement, attrs)
    {
        var picture = this.create('picture');
        var thumbnail = this.create('span', {class: 'thumbnail'}, picture);
        picture.createAndAttach('source', {srcset: this.album.thumbnail || 'dist/img/missing-cover-art.webp' });
        picture.createAndAttach('img', {src: 'dist/img/missing-cover-art.webp', onerror: "this.onerror = null;this.parentNode.children[0].srcset = this.src;" });

        return this.createAndAttach(coreElement, attrs, [
            thumbnail,
            this.$refs.title = this.create('h4', null, [this.album.title])
        ]);
    }

    getContextActions() 
    {
        var item = {
            artist: this.album.artist,
            album: this.album.title
        };

        var actions = {
            addToPlaylist: {
                title: 'Add to playlist',
                helpText: 'choose a playlist',
                icon: 'fa-plus',
                onClick: () => 
                {
                    this.fireEvent('item:intention:add-to-collection', {
                        items: [ item ]
                    });
                }
            },

            playNext: {
                title: 'Play next',
                helpText: 'play next',
                icon: 'fa-minus',
                onClick: () =>
                {
                    this.fireEvent('queue:intention:play-it-next', {item: item});
                }
            }
        };

        return actions;
    }
}

DiscographyItem.register();

export default DiscographyItem;
