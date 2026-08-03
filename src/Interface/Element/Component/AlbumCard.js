import ContextualElement from './ContextualElement';

/**
 * Represents an album in an artist's discography.
 *
 * @class
 */
class AlbumCard extends ContextualElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'album-card';

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

        this.subrenderCore();
        this.subRenderButton();
        this.subRenderEventListeners();
    }

    subRenderEventListeners()
    {
        this.$refs.playButton.addEventListener('click', () => 
        {
            this.fireEvent('queue:intention:play-this-now', {
                item: this.getItem()
            });
        });
    }

    subRenderButton()
    {
        this.$refs.playButton = this.createAndAttach('button', {}, this.create('span', {class: 'fa fa-play'}));
    }

    subRenderThumbnail()
    {
        return this.create('span', {class: 'thumbnail'}, 
            this.create('picture', null, [
                this.create('source', {srcset: this.album.thumbnail || 'dist/img/missing-cover-art.webp' }),
                this.create('img', {src: 'dist/img/missing-cover-art.webp', onerror: "this.onerror = null;this.parentNode.children[0].srcset = this.src;" })
            ])
        );
    }

    subrenderCore()
    {
        var attributes = {
            title: this.album.artist + ' - ' + this.album.title,
            href:  `#discover:albums?artist=${this.album.artist}&title=${this.album.title}`
        }

        this.createAndAttach('a', attributes, [
            this.subRenderThumbnail(),
            this.create('h4', null, [this.album.title])
        ]);
    }

    getItem()
    {
        return {
            artist: this.album.artist,
            album: this.album.title
        };
    }

    /**
     * @inheritdoc
     */
    getDefaultContextActions()
    {
        var item = this.getItem();

        var actions = {};

        actions.addToPlaylist = {
            title: 'Add to the collection',
            helpText: 'Choose a playlist',
            icon: 'fa-plus',
            onClick: () => 
            {
                this.fireEvent('item:intention:add-to-collection', {
                    items: [ item ]
                });
            }
        };

        actions.playNext = {
            title: 'Play next',
            helpText: 'Add to the queue',
            icon: 'fa-minus',
            onClick: () =>
            {
                this.fireEvent('queue:intention:play-it-next', {item: item});
            }
        };

        return actions;
    }
}

AlbumCard.register();

export default AlbumCard;
