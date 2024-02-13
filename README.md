# TV Voyager

TV Voyager is a web app built on top of TV Maze API using VueJS 3 (Composition API), Typescript, Pinia, Vitest and Vite. It allows that allows users to view a few lists of TV shows based on different genres.
You can search for TV shows and open a detail page with basic stats and a list of seasons/episodes

Due to the API not allowing to filter by genre all the filtering is done in the front-end. On first load, then it is then cached using Pinia. So when the user returns to the homepage the data is retrieved from the store.

I used Shadcn Vue for some UI components to speed up development. It's a collection of components with a focus on accessibility and ease of customization with CSS.
The nice thing is you dont install it as a dependecy. You only add the components you need into the project. This keeps the size low.

NodeJS: `21.6.1`
NPM: `8.15.0`
