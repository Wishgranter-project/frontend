import CustomElement from '../CustomElement';
import { PlayerYouTube } from 'youtube-wrapper';

customElements.define('youtube-player', PlayerYouTube);

class ReproductionControls extends CustomElement 
{
    static elementName = 'reproduction-controls';

    __construct(api) 
    {
        this.api = api;
    }

    render() 
    {
        this.$refs.playButton = this.createAndAttach('button', {class: 'button-play'}, this.create('span', {class: 'fa fa-play'}));
        this.$refs.playButton.addEventListener('click', this.toggle.bind(this));
        this.$refs.playerFrame = this.createAndAttach('div', {class: 'player-frame'});
    }

    async select(item) 
    {
        var r = await this.api.discover.resources({title: item.title, artist: item.artist});

        if (r.data[0]) {
            this.setUpPlayer(r.data[0]);
        } else {
            alert('Nothing found');
        }
    }

    toggle() 
    {
        this.controls.toggle();
    }

    isPaused() 
    {
        return this.controls.isPaused;
    }

    play() 
    {
        this.controls.play();
    }

    pause() 
    {
        this.controls.pause();
    }

    setUpPlayer(resource) 
    {
        this.destroyPlayer();
        window.controls = this.controls = this.createPlayer(resource);
    }

    destroyPlayer() 
    {
        this.$refs.playerFrame.clear()
    }

    createPlayer(resource) 
    {
        var videoId = resource.id.split(':')[1];

        var player = document.createElement('youtube-player');
        player.videoId = videoId;
        player.width = 390;

        player.appendTo(this.$refs.playerFrame).then(() => 
        {
            player.setVolume(15);
        })

        return player;
    }

}

ReproductionControls.register();

export default ReproductionControls;
