import CustomElement from '../CustomElement';
import { PlayerYouTube } from 'youtube-wrapper';
import { PlayerAudio } from 'html-multimedia-wrapper';
import Settings from '../../Settings/Settings';
import PlaylistItem from './PlaylistItem';

customElements.define('player-youtube', PlayerYouTube);
customElements.define('player-audio', PlayerAudio);

class ReproductionControls extends CustomElement 
{
    static elementName = 'reproduction-controls';

    __construct(api, item = null, resources = null) 
    {
        this.api       = api;
        this.item      = item;
        this.resources = resources;
        this.index     = 0;
        this.player    = null;
        this.settings  = new Settings('controls.settings');
    }

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

        if (! this.resources) {
            return;
        }
        
        this.addEventListener('player:timeupdate', this.onTimeUpdate.bind(this));

        this.addEventListener('player:ended', () => 
        {
            console.log('Reproduction: ended');
        });

        this.addEventListener('player:pause', () => 
        {
            console.log('Reproduction: paused');
        });

        this.playResource();
    }

    subRenderItem() 
    {        
        if (this.item) {
            this.$refs.playlistItem = this.attach(PlaylistItem.instantiate(this.item, {disablePlayButton: true}));
        }

        if (!this.resources || !this.resources.length) {
            return;
        }

        this.$refs.buttonNotIt = this.createAndAttach('button', {class: 'reproduction-controls__not-it', title: 'not it'}, this.create('span', {class: 'fa fa-refresh'}));
        this.$refs.buttonNotIt.addEventListener('click', this.notIt.bind(this));
    }

    subRenderClock() 
    {
        this.$refs.timer = this.createAndAttach('span', {class: 'reproduction-controls__timer'}, '--:--');
    }

    subRenderButtons() 
    {
        this.createAndAttach('div', {class: 'reproduction-controls__buttons button-group'}, [
            this.$refs.buttonBackward = this.createAndAttach('button', {class: 'reproduction-controls__button-next'}, this.create('span', {class: 'fa fa-backward'})),
            this.$refs.buttonPlay = this.createAndAttach('button', {class: 'reproduction-controls__button-play'}, this.create('span', {class: 'fa fa-play'})),
            this.$refs.buttonNext = this.createAndAttach('button', {class: 'reproduction-controls__button-next'}, this.create('span', {class: 'fa fa-forward'}))
        ]);

        this.$refs.buttonPlay.addEventListener('click', this.toggle.bind(this));

        this.$refs.buttonBackward.addEventListener('click', () => 
        {
            this.fireEvent('controls:backward');
        });

        this.$refs.buttonNext.addEventListener('click', () => 
        {
            this.fireEvent('controls:forward');
        });
    }

    subRenderVolume() 
    {
        this.$refs.volumeControl = this.createAndAttach('input', {type: 'range', min: 0, max: 100, step: 1, class: 'reproduction-controls__volume'});
        this.$refs.volumeControl.value = this.settings.getInt('volume', 15);
        this.$refs.volumeControl.addEventListener('change', this.dialVolume.bind(this));
    }

    subRenderQueueButton() 
    {
        this.$refs.buttonQueue = this.createAndAttach('button', {class: 'reproduction-controls__button-queue', title: 'Queue'}, this.create('span', {class: 'fa fa-list'}));
        this.$refs.buttonQueue.addEventListener('click', () =>
        {
            this.fireEvent('summon-queue');
        });
    }

    subRenderProgressBar() 
    {
        this.$refs.progress = this.createAndAttach('progress', {max: 100, class: 'reproduction-controls__progress'});
        this.$refs.progress.addEventListener('click', this.seek.bind(this));
    }

    notIt() 
    {
        if (!this.resources[this.index + 1]) {
            alert('no more alternatives');
            return;
        }

        this.index ++;

        this.destroyPlayer();

        this.playResource(this.index);
    }

    playResource(index = 0) 
    {
        console.log('Reproduction: booting player');

        window.player = 
        this.player = this.createPlayer(this.resources[index]);
        
        this.player.appendTo(this.$refs.playerFrame).then(() => 
        {
            this.player.play();
            this.player.setVolume(this.settings.getInt('volume', 15));
            console.log('Reproduction: reproducing audio');
        });
    }

    destroyPlayer() 
    {
        if (this.player) {
            this.player.pause();
            this.player.remove();
        }

        return this;
    }

    createPlayer(resource) 
    {
        switch (resource.source) {
            case 'youtube':
                return this.createPlayerYouTube(resource);
                break;
            case 'sliderkz':
                return this.createPlayerSliderKz(resource);
                break;
        }
    }

    createPlayerYouTube(resource) 
    {
        var player     = document.createElement('player-youtube');
        player.videoId = resource.id;
        player.width   = 390;

        return player;
    }

    createPlayerSliderKz(resource) 
    {
        var player = document.createElement('player-audio');
        player.src = resource.src;

        return player;
    }

    //--------

    toggle() 
    {
        if (this.player) {
            this.player.toggle();
        }
    }

    onTimeUpdate() 
    {
        this.$refs.timer.innerHTML = this.player.currentTimeFormatted;
        this.$refs.progress.value  = this.player.currentTimePercentage;
    }

    dialVolume(evt) 
    {
        var volume = evt.target.value;
        this.settings.set('volume', volume);

        if (!this.player) {
            return;
        }

        this.player.setVolume(volume);
    }

    seek(evt) 
    {
        if (!this.player) {
            return;
        }

        var x, width, perc;
        x     = evt.clientX - this.$refs.progress.offsetLeft;
        width = this.$refs.progress.offsetWidth;
        perc  = Math.ceil((x / width) * 100)+'%';

        this.player.seek(perc);
    }
}

ReproductionControls.register();

export default ReproductionControls;
