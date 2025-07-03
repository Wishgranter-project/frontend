# Wishgranter music player ( frontend )

In early development.

This is a little project of mine, a web based music player.

This repository contains the front-end, the server can be found [here](https://github.com/adinan-cenci/player-backend).

# Features

List of features and status of implemenetation.  

## Playlists

:heavy_check_mark: Create new playlists.  
:heavy_check_mark: List playlist.  
:heavy_check_mark: Edit playlists.  
:heavy_check_mark: Delete playlists.  
:heavy_check_mark: Download playlists as zip file.

## Playlist items

:heavy_check_mark: Create new items.  
:heavy_check_mark: Edit existing items.  
:heavy_check_mark: Select and add multiple items to playlist at the same time.  
:heavy_check_mark: Drag and drop multiple items into a playlist NAME to add them at the same time.  
:x: Drag and drop multiple items into a playlist to add them at the same time.
:heavy_check_mark: Drag and drop multiple items to change their order in the playlist.
:heavy_check_mark: Drag and drop items on the pagination number to change their order in the playlist.
:heavy_check_mark: Search items by title, genre and artist, among all playlists as well as individually.  
:heavy_check_mark: Delete existing items.  

## Navigability

:heavy_check_mark: Tabs: open links into tabs.  
:heavy_check_mark: Tabs are restored after refreshing the page.

### Pagination

:heavy_check_mark: Pagination.  
:heavy_check_mark: Prev/Next buttons displayed once there is a minimum of number of pages.  
:heavy_check_mark: Limited number of pages to be displayed at once.  
:heavy_check_mark: Visual indication of the current page.  

## Discoverability

:x: Search artist by musical genre.  
:x: Search for similar artists.  
:heavy_check_mark: Search artists by name.  
:heavy_check_mark: Search albuns by artist name.  
:heavy_check_mark: Add items from search results into playlists.  
:heavy_check_mark: Add entire albuns worth of tracks to playlist.  
:heavy_check_mark: Add entire albuns to playlist.  
:heavy_check_mark: Add single track to playlist.  

## Reproduction

:heavy_check_mark: Reproduce multimidia from different sources.  
:heavy_check_mark: Youtube videos.  
:heavy_check_mark: mp3 files.  

### History system

:heavy_check_mark: History system to save items previously reproduced.  
:heavy_check_mark: History survives page refresh.  
:heavy_check_mark: Add items into playlists.  

### Queue system

:heavy_check_mark: Queue system.  
:heavy_check_mark: Inspect the contents of the queue.  
:heavy_check_mark: Queue survives refreshing the page.  
:heavy_check_mark: Support playlists: play from start to finish.  
:heavy_check_mark: Support search results: play from start to finish.  
:heavy_check_mark: Support discoverability: add items from albums.  
:heavy_check_mark: Add entire albums.  
:heavy_check_mark: Add artist's entire discographies.  
:heavy_check_mark: Skipp items.  
:heavy_check_mark: Rewind, play previous items.  
:heavy_check_mark: Cut the line, move item withing the queue to beginning and begin play it.  
:x: Cut the line, move multiple items within the queue to play next.
:heavy_check_mark: Cut the line, move item within the queue to play next.
:heavy_check_mark: Cut the line, add item to play next from outside the queue.  
:x: Cut the line, add multiple items from without the queue to play next.
:heavy_check_mark: Re-order queue by dragging and dropping.  
:heavy_check_mark: Remove specific items from the queue.  
:x: Remove multiple selected items at once.
:heavy_check_mark: Add queue items into playlists.  
:x: Drag and drop into the queue.  
:heavy_check_mark: Shuffle system. 

### Playback control

:heavy_check_mark: Update timer and progress bar as playback progresses.   
:heavy_check_mark: Rewind/fast-forward by clicking in the progress bar.  
:heavy_check_mark: Pause/play button.  
:heavy_check_mark: Add current playing item into playlists.  
:heavy_check_mark: Control volume.  
:x: Keyboard shortcuts.  
