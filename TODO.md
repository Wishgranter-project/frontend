# To do

- [ ] Queue and context need to be separated, it should not be the former's 
responsability to fetch its own content. Better to have a new object to manage 
both queue and context.

- [ ] App.js is really confusing, really hard to read. Its methods need to be 
revised and most likely moved to a new class, responsabilities need to be
reconsider.

- [ ] NavigationItemPlaylist.js: Better to remove the api as a dependency of the
element, perhaps it wold be best to cause the element to fire an event and let
App.js or other communicate with the backend.

- [ ] ViewPlaylist.js: Similar to NavigationItemPlaylist.js, move those api
calls to somewhere else.

