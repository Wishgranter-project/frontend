import CustomElement from '../CustomElement';

class ReproductionControls extends CustomElement 
{
    static elementName = 'reproduction-controls';

    __construct(api) 
    {
        this.api = api;
    }

    connectedCallback() 
    {
        this.$refs.playButton = this.createAndAttach('button', {class: 'button-play'}, this.create('span', {class: 'fa fa-play'}));
        this.$refs.playButton.addEventListener('click', this.playPause.bind(this));
        this.$refs.playerFrame = this.createAndAttach('div', {class: 'player-frame'});
    }

    async select(item) 
    {
        // var r = item.uuid 
        //     ? await this.api.collection.item.source.list(item.uuid)
        //     : await this.api.discover.source.search({title: item.title, artist: item.artist});

        var r = await this.api.discover.resources({title: item.title, artist: item.artist});

        if (r.data[0]) {
            this.setUpPlayer(r.data[0]);
        } else {
            alert('Nothing found');
        }
    }

    playPause() 
    {
        this.isPaused()
            ? this.play()
            : this.pause();
    }

    isPaused() 
    {
        return this.controls.getPlayerState() == 2;
    }

    play() 
    {
        this.controls.playVideo();
    }

    pause() 
    {
        this.controls.pauseVideo();
    }

    setUpPlayer(resource) 
    {
        this.destroyPlayer();
        this.controls = this.createPlayer(resource);
    }

    destroyPlayer() 
    {
        this.$refs.playerFrame.clear()
    }

    createPlayer(resource) 
    {
        var videoId = resource.id.split(':')[1];

        var embedId = 'youtube-' + videoId;
        var embed = this.create('div', {id: embedId});
        this.$refs.playerFrame.append(embed);
        
        return new YT.Player(embedId, {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
              playsinline: 1,
              autoplay: 1
            }/*,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }*/
        });
    }

}

ReproductionControls.register();

export default ReproductionControls;
