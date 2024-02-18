# Music player ( front-end )

In early development.

This is a little project of mine, a web based music player.

This repository contains the front-end, the server can be found [here](https://github.com/adinan-cenci/player-backend).

# Features

List of features and status of implemenetation.  

## Playlists

:heavy_check_mark: Edit existing playlists.  
:heavy_check_mark: List playlist.  
:heavy_check_mark: Create new playlists.  
:heavy_check_mark: Delete existing playlists.  

## Playlist items

:heavy_check_mark: Create new items.  
:heavy_check_mark: Edit existing items.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Add the same item to different playlists.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Edit the same item and have it reflect in other playlists it is also present.  
:heavy_check_mark: Search items by title, genre and artist.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Among all the playlists.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: In individual playlists.  
:heavy_check_mark: Delete existing items.  
:x: Change order of items inside playlists.  

## Navigability

:heavy_check_mark: Pagination.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Prev/Next buttons after a threshold.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: limited number of pages after a threshold ( to not get too crowded with pages ).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: visual indication of the current page.  

## Discoverability

:heavy_check_mark: Support for discography resources ( Last Fm, Discogs etc ).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Last Fm.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Discogs.  
:x: Search artist by musical genre.  
:x: Search for similar artists.  
:heavy_check_mark: Search artists by name.  
:heavy_check_mark: Search albuns by artist name.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Add tracks search results to playlists.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Add entire albuns worth of tracks to playlist.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Add single track to playlist.  

## Reproduction

:heavy_check_mark: Search for multimidia in different sources ( Youtube, Spotify etc ).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Youtube.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: ~~SliderKz~~ ( service defunct ).  
:heavy_check_mark: Reproduce multimidia from different sources.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Youtube.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: ~~SliderKz~~ ( service defunct ).  
:heavy_check_mark: Queue system.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Queue content and previous items are saved and survive refreshing the page.   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Automatically playing queue items, one after the other.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of playing entire queues, start to finish.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Playlists  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Search results  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of skipping to the next item in queue.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of going backwards to the previous item in queue.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of visualizing the contents of the queue.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of jumping a selected item to the front of the queue.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of removing specific items from the queue.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of adding queue and story items into playlists.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Ability of adding items to the haphazardly.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Queue automatically fetches more items based on context.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: From playlist.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: From search results.  
:heavy_check_mark: Control playback  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Update timer as track progresses.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Update progress bar as track progresses.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Control playback by clicking in the progress bar.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Pause/play button.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: ability to add current playing item into playlists.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :heavy_check_mark: Control reproduction volume.  
:x: Keyboard shortcuts.  

