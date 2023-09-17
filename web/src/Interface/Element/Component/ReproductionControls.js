import CustomElement from '../CustomElement';
import { PlayerYouTube } from 'youtube-wrapper';
import { PlayerAudio } from 'html-multimedia-wrapper';

customElements.define('player-youtube', PlayerYouTube);
customElements.define('player-audio', PlayerAudio);

class ReproductionControls extends CustomElement 
{
    static elementName = 'reproduction-controls';

    __construct(api) 
    {
        this.api = api;
        this.volume = 15;
    }

    render() 
    {
        this.$refs.timer = this.createAndAttach('span', {class: 'reproduction-controls__timer'});
        this.$refs.playButton = this.createAndAttach('button', {class: 'button-play'}, this.create('span', {class: 'fa fa-play'}));
        this.$refs.volumeControl = this.createAndAttach('input', {type: 'range', min: 0, max: 100, step: 1, class: 'reproduction-controls__volume'});
        this.$refs.progress = this.createAndAttach('progress', {max: 100, class: 'reproduction-controls__progress'});
        this.$refs.playerFrame = this.createAndAttach('div', {class: 'player-frame intangible'});

        this.$refs.volumeControl.value = this.volume;

        this.$refs.progress.addEventListener('click', this.seek.bind(this));
        this.$refs.playButton.addEventListener('click', this.toggle.bind(this));
        this.$refs.volumeControl.addEventListener('change', this.dialVolume.bind(this));
        this.addEventListener('player:timeupdate', this.onTimeUpdate.bind(this));

        this.addEventListener('player:ended', () => 
        {
            console.log('Reproduction: ended')
        });

        this.addEventListener('player:pause', () => 
        {
            console.log('Reproduction: paused')
        });
    }

    playResource(resource) 
    {
        console.log('Reproduction: booting player');

        if (this.player) {
            this.destroyPlayer(this.player);
        }

        window.player = 
        this.player = this.createPlayer(resource);
        this.attachPlayer(this.player);
    }

    attachPlayer(player) 
    {
        player.appendTo(this.$refs.playerFrame).then(() => 
        {
            player.setVolume(15);
            player.play();
            player.setVolume(this.volume);
            console.log('Reproduction: reproducing audio');
        });
    }

    destroyPlayer(player) 
    {        
        player.pause();
        player.remove();
    }

    createPlayer(resource) 
    {
        switch (resource.vendor) {
            case 'youtube':
                return this.createPlayerYouTube(resource);
                break;
            case 'slider_kz':
                return this.createPlayerSliderKz(resource);
                break;
        }
    }

    createPlayerYouTube(resource) 
    {
        var videoId    = resource.id.split('@')[0];
        var player     = document.createElement('player-youtube');
        player.videoId = videoId;
        player.width   = 390;

        return player;
    }

    createPlayerSliderKz(resource) 
    {
        var player = document.createElement('player-audio');
        player.src = resource.source;

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
        if (this.player) {
            this.volume = evt.target.value;
            this.player.setVolume(this.volume);
        }
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
