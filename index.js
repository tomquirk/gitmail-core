module.exports = octokit => {
  const DEFAULT_PER_PAGE = 100;

  const listStargazersForRepo = (owner, repo, pageLimit = -1) => {
    const _request = (users = [], page = 1) => {
      return octokit.activity
        .listStargazersForRepo({
          owner,
          repo,
          per_page: DEFAULT_PER_PAGE,
          page
        })
        .then(res => {
          if (!res) return users;
          users = users.concat(res.data);
          if (res.data.length < DEFAULT_PER_PAGE || page === pageLimit)
            return users;
          return _request(users, page + 1);
        });
    };

    return _request();
  };

  const listWatchersForRepo = (owner, repo, pageLimit = -1) => {
    const _request = (users = [], page = 1) => {
      return octokit.activity
        .listWatchersForRepo({
          owner,
          repo,
          per_page: DEFAULT_PER_PAGE,
          page
        })
        .then(res => {
          if (!res) return users;
          users = users.concat(res.data);
          if ((res.data.length < DEFAULT_PER_PAGE, page === pageLimit))
            return users;
          return _request(users, page + 1);
        });
    };

    return _request();
  };

  const listRepoFollowers = (owner, repo) => {
    return Promise.all([
      listStargazersForRepo(owner, repo),
      listWatchersForRepo(owner, repo)
    ]).then(([stargazers, watchers]) => {
      const users = stargazers;
      watchers.forEach(user => {
        if (!users.some(u => u.login === user.login)) users.push(user);
      });

      return Promise.all(
        users
          .filter(user => user.login)
          .map(user => {
            return octokit.users
              .getByUsername({ username: user.login })
              .then(res => res.data);
          })
      );
    });
  };

  return {
    listRepoFollowers
  };
};
