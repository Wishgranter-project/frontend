import CustomElement from '../CustomElement';
import { PlayerYouTube } from 'youtube-wrapper';
import { PlayerAudio } from 'html-multimedia-wrapper';
import Settings from '../../Settings/Settings.js';

customElements.define('player-youtube', PlayerYouTube);
customElements.define('player-audio', PlayerAudio);

class ReproductionControls extends CustomElement 
{
    static elementName = 'reproduction-controls';

    __construct(api, item = null, resource = null) 
    {
        this.api      = api;
        this.item     = item;
        this.resource = resource;
        this.player   = null;
        this.settings = new Settings('controls.settings');

        if (this.item && this.item.artist && !Array.isArray(this.item.artist)) {
            this.item.artist = [this.item.artist];
        }
    }

    render() 
    {
        this.classList.add('reproduction-controls');
        this.createAndAttach('div', {class: 'reproduction-controls__label'}, [
            this.$refs.title = this.createAndAttach('div', {class: 'reproduction-controls__title'}),
            this.$refs.artists = this.createAndAttach('div', {class: 'reproduction-controls__artists'})
        ]);
        this.$refs.timer = this.createAndAttach('span', {class: 'reproduction-controls__timer'}, ['--:--']);

        this.createAndAttach('div', {class: 'reproduction-controls__buttons button-group'}, [
            this.$refs.buttonBackward = this.createAndAttach('button', {class: 'reproduction-controls__button-next'}, this.create('span', {class: 'fa fa-backward'})),
            this.$refs.buttonPlay = this.createAndAttach('button', {class: 'reproduction-controls__button-play'}, this.create('span', {class: 'fa fa-play'})),
            this.$refs.buttonNext = this.createAndAttach('button', {class: 'reproduction-controls__button-next'}, this.create('span', {class: 'fa fa-forward'}))
        ]);

        this.$refs.volumeControl = this.createAndAttach('input', {type: 'range', min: 0, max: 100, step: 1, class: 'reproduction-controls__volume'});
        this.$refs.buttonQueue   = this.createAndAttach('button', {class: 'reproduction-controls__button-queue', title: 'Queue'}, this.create('span', {class: 'fa fa-list'}));
        this.$refs.progress      = this.createAndAttach('progress', {max: 100, class: 'reproduction-controls__progress'});
        this.$refs.playerFrame   = this.createAndAttach('div', {class: 'player-frame intangible'});

        this.$refs.volumeControl.value = this.settings.getInt('volume', 15);
        this.$refs.volumeControl.addEventListener('change', this.dialVolume.bind(this));

        this.$refs.buttonQueue.addEventListener('click', () =>
        {
            this.fireEvent('summon-queue');
        });

        if (! this.resource) {
            return;
        }

        this.$refs.title.innerHTML = this.item.title;
        for (var a of this.item.artist) {
            this.$refs.artists.createAndAttach('a', null, a);
        }

        this.$refs.progress.addEventListener('click', this.seek.bind(this));
        this.$refs.buttonPlay.addEventListener('click', this.toggle.bind(this));
        this.addEventListener('player:timeupdate', this.onTimeUpdate.bind(this));

        this.addEventListener('player:ended', () => 
        {
            console.log('Reproduction: ended')
        });

        this.addEventListener('player:pause', () => 
        {
            console.log('Reproduction: paused');
        });

        this.$refs.buttonBackward.addEventListener('click', () => 
        {
            alert('not implemented yet');
        });

        this.$refs.buttonNext.addEventListener('click', () => 
        {
            this.fireEvent('controls:forward');
        });

        this.playResource();
    }

    playResource() 
    {
        console.log('Reproduction: booting player');

        window.player = 
        this.player = this.createPlayer(this.resource);
        
        this.player.appendTo(this.$refs.playerFrame).then(() => 
        {
            this.player.play();
            this.player.setVolume(this.settings.getInt('volume', 15));
            console.log('Reproduction: reproducing audio');
        });
    }

    destroy() 
    {
        if (this.player) {
            this.player.pause();
            this.player.remove();
        }

        return this;
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
