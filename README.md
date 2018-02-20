# player-client

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

To see game field with all the players, go to the `Players` link on the index page.

Players:
- Are able to see any other players in the area of 32x32 squares. You can move this field of view,
using `W,A,S,D` buttons.

To stop and start tasks for players, go to the `Moderators` link on the index page.

Moderators:
- Are able to search for a player by row-column pair.
- Stop (erase) tasks for players, until there is only 1 left.
- Add a new task for a certain player, if his number of tasks `N` < 4.
