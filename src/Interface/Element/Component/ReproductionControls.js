import PlayableYouTube from 'playable-youtube-wrapper';
import PlayableAudio   from 'playable-html-wrapper';
import PlaylistItem    from './PlaylistItem';
import CustomElement   from '../CustomElement';
import State           from '../../../State/State';

customElements.define('player-youtube', PlayableYouTube);
customElements.define('player-audio', PlayableAudio);

/**
 * A bar with elements to controll the reproduction of music.
 */
class ReproductionControls extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'reproduction-controls';

    /**
     * Constructor.
     *
     * @param {Api} api
     * The object to communicate with the back-end.
     * @param {Object} item
     * Object describing the music to play.
     * @param {Array|Null} playableResources
     * List of playable resources that match the music description's.
     * @param {Boolean} autoPlay
     * Wether it should reproduction imediately.
     * @param {Boolean} shuffleOn
     * Indicates wether shuffle is on or off.
     */
    __construct(api, item = null, playableResources = null, autoPlay = true, shuffleOn = false)
    {
        super.__construct();
        this.api               = api;
        this.item              = item;
        this.playableResources = playableResources;
        this.index             = 0;
        this.player            = null;
        this.state             = new State('controls.state');
        this.autoPlay          = autoPlay;
        this.shuffleOn         = shuffleOn;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('reproduction-controls');
        this.subRenderItem();
        this.subRenderClock();
        this.subRenderButtons();
        this.subRenderVolume();
        this.subRenderQueueButton();
        this.subRenderProgressBar();
        this.$refs.playerFrame = this.createAndAttach('div', {class: 'player-frame intangible'});

        this.shuffleOn
            ? this.turnShuffleOn()
            : this.turnShuffleOff();

        if (! this.playableResources) {
            return;
        }
        
        this.addEventListener('playable:timeupdate', this.onTimeUpdate.bind(this));

        this.addEventListener('playable:ended', () => 
        {
            console.log('Reproduction: ended');
        });

        this.addEventListener('playable:pause', () => 
        {
            console.log('Reproduction: paused');
        });

        this.addEventListener('playable:error', (evt) =>
        {
            console.error(evt.detail);
            this.notIt();
        });

        this.setupResource(0, this.autoPlay);
    }

    /**
     * Renders the music currently playing.
     *
     * @protected
     */
    subRenderItem()
    {        
        if (this.item) {
            const playItem = PlaylistItem.instantiate(this.item, {disablePlayButton: true, userId: this.api.defaultUserId});
            this.$refs.playlistItem = this.attach(playItem);
        }

        if (!this.playableResources || !this.playableResources.length) {
            return;
        }

        this.$refs.buttonNotIt = this.createAndAttach('button', {class: 'reproduction-controls__not-it', title: 'not it'}, this.create('span', {class: 'fa fa-refresh'}));
        this.$refs.buttonNotIt.addEventListener('click', this.notIt.bind(this));
    }

    /**
     * Renders the timer.
     *
     * @protected
     */
    subRenderClock()
    {
        this.$refs.timer = this.createAndAttach('span', {class: 'reproduction-controls__timer'}, '--:--');
    }

    /**
     * Renders the reproduction controls.
     *
     * Play/pause, previous and next music.
     *
     * @protected
     */
    subRenderButtons()
    {
        this.createAndAttach('div', {class: 'reproduction-controls__buttons button-group'}, [
            this.$refs.buttonBackward = this.create('button', {class: 'reproduction-controls__button-next'}, this.create('span', {class: 'fa fa-backward'})),
            this.$refs.buttonPlay     = this.create('button', {class: 'reproduction-controls__button-play'}, this.create('span', {class: 'fa fa-play'})),
            this.$refs.buttonNext     = this.create('button', {class: 'reproduction-controls__button-next'}, this.create('span', {class: 'fa fa-forward'}))
        ]);

        this.$refs.buttonShuffle = this.createAndAttach('button', {class: 'reproduction-controls__shuffle', 'title': 'toggle shuffle'}, this.create('span', {class: 'fa fa-random'}));

        this.$refs.buttonPlay.addEventListener('click', this.toggle.bind(this));

        this.$refs.buttonBackward.addEventListener('click', () => 
        {
            this.fireEvent('queue:intention:rewind');
        });

        this.$refs.buttonNext.addEventListener('click', () => 
        {
            this.fireEvent('queue:intention:forward');
        });

        this.$refs.buttonShuffle.addEventListener('click', () =>
        {
            this.fireEvent('player:intention:toggle-shuffle');
        })
    }

    /**
     * Renders the volume slider.
     *
     * @protected
     */
    subRenderVolume()
    {
        this.$refs.volumeControl = this.createAndAttach('input', {type: 'range', min: 0, max: 100, step: 1, class: 'reproduction-controls__volume'});
        this.$refs.volumeControl.value = this.state.getInt('volume', 15);
        this.$refs.volumeControl.addEventListener('change', this.onDialVolume.bind(this));
    }

    /**
     * Renders the button to summon the queue.
     *
     * @protected
     */
    subRenderQueueButton()
    {
        this.$refs.buttonQueue = this.createAndAttach('button', {class: 'reproduction-controls__button-queue', title: 'Queue'}, this.create('span', {class: 'fa fa-list'}));
        this.$refs.buttonQueue.addEventListener('click', () =>
        {
            this.fireEvent('gui:summon-queue');
        });
    }

    /**
     * Renders the progress bar.
     *
     * @protected
     */
    subRenderProgressBar()
    {
        this.$refs.progress = this.createAndAttach('progress', {max: 100, class: 'reproduction-controls__progress'});
        this.$refs.progress.addEventListener('click', this.onSeek.bind(this));
    }

    remove()
    {
        this.destroyPlayer();
        return super.remove();
    }

    turnShuffleOff()
    {
        this.$refs.buttonShuffle.setAttribute('title', 'turn shuffle on');
    }

    turnShuffleOn()
    {
        this.$refs.buttonShuffle.setAttribute('title', 'turn shuffle off');
    }

    /**
     * Cycles to the next available playable resource.
     *
     * @protected
     */
    notIt()
    {
        if (!this.playableResources[this.index + 1]) {
            alert('no more alternatives');
            return;
        }

        this.index++;

        this.destroyPlayer();

        this.playResource(this.index);
    }

    playResource(index = 0)
    {
        this.setupResource(index, true);
    }

    setupResource(index = 0, play = true)
    {
        console.log('Reproduction: booting player');

        window.player = 
        this.player = this.createPlayer(this.playableResources[index]);

        if (!this.player) {
            console.error('Could not instantiate a player');
            return;
        }
        
        this.player.appendTo(this.$refs.playerFrame).then(() => 
        {
            this.setMediaSession(this.playableResources[index]);
            if (play) {
                this.player.play();
            }
            this.player.setVolume(this.state.getInt('volume', 15));
            console.log('Reproduction: reproducing audio');
        });
    }

    setMediaSession(resource)
    {
        if (!'mediaSession' in navigator) {
            return;
        }

        var { title, artist, album } = this.item;

        artist = Array.isArray(artist)
            ? artist.join(', ')
            : artist;

        var mediaMetadata = new MediaMetadata({
            title,
            artist,
            album
        });

        if (resource.thumbnail) {
            mediaMetadata.artwork = [
                {
                  src: resource.thumbnail,
                  sizes: '120x90',
                  type: 'image/jpeg'
                }
            ];
        }

        navigator.mediaSession.metadata = mediaMetadata;
    }

    /**
     * Destroys the player.
     *
     * @protected
     *
     * @returns {ReproductionControls}
     * Itself.
     */
    destroyPlayer()
    {
        if (this.player) {
            this.player.pause();
            this.player.remove();
        }

        return this;
    }

    /**
     * Instantiates the player.
     *
     * @protected
     *
     * @param {Object} resource
     * Playable resource.
     *
     * @returns {Playable}
     * HTML element to control the playback.
     */
    createPlayer(resource)
    {
        switch (resource.sourceId) {
            case 'youtube':
                return this.createPlayerYouTube(resource);
                break;
            case 'sliderkz':
            case 'localFiles':
                return this.createGenericPlayer(resource);
                break;
        }
    }

    /**
     * Instantiates an youtube player.
     *
     * @param {Object} resource
     * Playable resource.
     *
     * @returns {Playable}
     * HTML element to control the playback.
     */
    createPlayerYouTube(resource)
    {
        var player     = document.createElement('player-youtube');
        player.videoId = resource.id;
        player.width   = 390;

        return player;
    }

    /**
     * Instantiates an generic player.
     *
     * @param {Object} resource
     * Playable resource.
     *
     * @returns {Playable}
     * HTML element to control the playback.
     */
    createGenericPlayer(resource)
    {
        var player = document.createElement('player-audio');
        player.src = resource.src;

        return player;
    }

    //--------

    /**
     * Plays/pauses the reproduction.
     */
    toggle()
    {
        if (this.player) {
            this.player.toggle();
        }
    }

    /**
     * Event listener.
     *
     * @protected
     *
     * Reacts on the progress of the music being reproduced and updates the
     * clock and the progress bar.
     */
    onTimeUpdate()
    {
        this.$refs.timer.innerHTML = this.player.currentTimeFormatted;
        this.$refs.progress.value  = this.player.currentTimePercentage;
    }

    /**
     * Event listener.
     *
     * Reacts on the volume control being interacted with and updates the
     * volume.
     *
     * @protected
     *
     * @param {Event} evt
     * Event.
     */
    onDialVolume(evt)
    {
        var volume = evt.target.value;
        this.state.set('volume', volume);

        if (this.player) {
            this.player.setVolume(volume);
        }
    }

    /**
     * Event listener.
     *
     * Reacts on the progress bar being interacted with seeks the music new
     * time stamp.
     *
     * @protected
     *
     * @param {Event} evt
     * Event.
     */
    onSeek(evt)
    {
        if (!this.player) {
            return;
        }

        var x, width, perc;
        x     = evt.clientX - this.$refs.progress.offsetLeft;
        width = this.$refs.progress.offsetWidth;
        perc  = Math.ceil((x / width) * 100) + '%';

        this.player.seek(perc);
    }
}

ReproductionControls.register();

export default ReproductionControls;
