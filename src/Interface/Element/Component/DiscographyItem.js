import ContextualElement from './ContextualElement';

/**
 * Represents an item in an artist's discography.
 *
 * Be it a full featured album or a single.
 *
 * @class
 */
class DiscographyItem extends ContextualElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'discography-item';

    /**
     * Constructor.
     *
     * @param {Object} album
     * Description of the album.
     */
    __construct(album)
    {
        super.__construct();
        this.album = album;
    }

    /**
     * @inheritdoc
     */
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

    /**
     * Renders the item as a single.
     *
     * @protected
     *
     * @param {Object} attributes
     * Attributes for the element.
     */
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

    /**
     * Renders the item as an album.
     *
     * @protected
     *
     * @param {Object} attributes
     * Attributes for the element.
     */
    subRenderAlbum(attributes)
    {
        attributes.href = `#discover:albums?artist=${this.album.artist}&title=${this.album.title}`;
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

    /**
     * Renders the play button.
     *
     * @protected
     *
     * @returns {HTMLElement}
     * The play button.
     */
    subRenderPlayButton()
    {
        return this.$refs.playButton = this.createAndAttach('button', {}, this.create('span', {class: 'fa fa-play'}));
    }

    /**
     * Renders the core of the item.
     *
     * @protected
     * 
     * @param {String} coreElement
     * Tag name.
     * @param {Object} attributes
     * Attributes for the element.
     *
     * @returns {HTMLElement}
     * The new element.
     */
    subRenderCore(coreElement, attributes)
    {
        var picture = this.create('picture');
        var thumbnail = this.create('span', {class: 'thumbnail'}, picture);

        picture.createAndAttach('source', {srcset: this.album.thumbnail || 'dist/img/missing-cover-art.webp' });
        picture.createAndAttach('img', {src: 'dist/img/missing-cover-art.webp', onerror: "this.onerror = null;this.parentNode.children[0].srcset = this.src;" });

        return this.createAndAttach(coreElement, attributes, [
            thumbnail,
            this.$refs.title = this.create('h4', null, [this.album.title])
        ]);
    }

    /**
     * @inheritdoc
     */
    getDefaultContextActions()
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
