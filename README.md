# BINGO FRIENDS

You've heard about bingo, so now prepare for BINGO FRIENDS!!!

### How to use:
1. You need to keep this away from the friend whose the bingo subject.
2. You need to make a list of phrases he uses commonly.
3. You are not allowed to try luring your friend to say these phrases.

## Local Editing

1. Use the package manager [npm](https://www.npmjs.com/) to install the node modules.
```bash
npm install
```
2. After making the list on the `How to use guide`, just add this list on ./src/data/tileOptions.js.

### Deploying to Production

Just commit and push to main (or make a pull request from your local branch).
When anything gets added to main, it is built and deployed within minute on the website.

* If you want to open it on your own website, just don't forget to use `npm run build` for the bundling
* and `npm run dev` to test it locally before you deploy it. Then get a hosting service such as vercel
* and connect it to your repo.
