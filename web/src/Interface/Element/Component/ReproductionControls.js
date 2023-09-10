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
    }

    render() 
    {
        this.$refs.timer = this.createAndAttach('span', {class: 'timer'});
        this.$refs.playButton = this.createAndAttach('button', {class: 'button-play'}, this.create('span', {class: 'fa fa-play'}));
        this.$refs.playButton.addEventListener('click', this.toggle.bind(this));
        this.$refs.progress = this.createAndAttach('progress', {max: '100'});
        this.$refs.playerFrame = this.createAndAttach('div', {class: 'player-frame intangible'});

        this.addEventListener('player:timeupdate', this.updateTimeDisplay.bind(this));
    }

    playResource(resource) 
    {
        if (this.player) {
            this.destroyPlayer(this.player);
        }

        window.player = this.player = this.createPlayer(resource);
        this.attachPlayer(this.player);
    }

    attachPlayer(player) 
    {
        player.appendTo(this.$refs.playerFrame).then(() => 
        {
            player.setVolume(15);
            player.play();
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
        var videoId    = resource.id.split(':')[1];
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

    updateTimeDisplay() 
    {
        this.$refs.timer.innerHTML = this.player.currentTimeFormatted;
        this.$refs.progress.value  = this.player.currentTimePercentage;
    }
}

ReproductionControls.register();

export default ReproductionControls;
