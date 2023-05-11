const { pipe, map, path, filter, head, mergeDeepLeft } = require("ramda");

const getAuthor = (id) => pipe(
  path(["result", "authors"]),
  filter(item => item.id === id),
  head
);

const getJoin = (data) =>
  pipe(
    path(["result", "books"]),
    map(item =>
      mergeDeepLeft(item, getAuthor(item.author)(data))
    )
  )(data);

module.exports = {
  getJoin
}