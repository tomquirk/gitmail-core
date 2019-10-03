# gitmail-core

Core for [gitmail.io](https://gitmail.io)

## Usage

```js
const Gitmail = require('gitmail');
const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: accessToken
})

const gitmail = Gitmail(octokit)

gitmail.listRepoFollowers('tomquirk', 'linkedin-api')
.then(users => {
  // send an email to all users
})

```
