import reducer from './user';
import * as actionTypes from '../actions/actionTypes';

const stubState = {
};

describe('Blog Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({
      user: [],
      articles: [],
      selectedArticle: null,
      comments: [],
      selectedComment: null,
    });
  });

  it('should login', () => {
    let newState = reducer(stubState, {
      type: actionTypes.LOGIN,
      logged_in: true,
    });
    expect(newState).toEqual({
      ...stubState,
      user: [{ ...stubState.user[0], logged_in: true }, stubState.user[1], stubState.user[2]],
    });
    newState = reducer(newState, {
      type: actionTypes.LOGIN,
      logged_in: false,
    });
    expect(newState).toEqual(stubState);
  });

  it('should get user1', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_USER1,
      user: stubState.user[0],
    });
    expect(newState).toEqual({
      user: [stubState.user[0]],
      articles: [],
      selectedArticle: null,
      comments: [],
      selectedComment: null,
    });
  });

  it('should get all users', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_ALL_USERS,
      user: stubState.user,
    });
    expect(newState).toEqual({
      user: stubState.user,
      articles: [],
      selectedArticle: null,
      comments: [],
      selectedComment: null,
    });
  });

  it('should get all articles', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_ALL_ARTICLES,
      articles: stubState.articles,
    });
    expect(newState).toEqual({
      user: [],
      articles: stubState.articles,
      selectedArticle: null,
      comments: [],
      selectedComment: null,
    });
  });

  it('should get only one article', () => {
    const newState = reducer(stubState, {
      type: actionTypes.GET_ARTICLE,
      article: stubState.articles[0],
    });
    expect(newState).toEqual({
      ...stubState, selectedArticle: stubState.articles[0],
    });
  });

  it('should create article', () => {
    const article = {
      id: 0, author_id: 1, title: '10 React JS Articles', content: 'Hello Guys',
    };
    const newState = reducer(undefined, {
      type: actionTypes.CREATE_ARTICLE,
      article,
    });
    expect(newState).toEqual({
      user: [],
      articles: [article],
      selectedArticle: null,
      comments: [],
      selectedComment: null,
    });
  });

  it('should edit article', () => {
    const article1 = {
      id: 0, author_id: 1, title: '9 React JS Articles', content: 'Hello Guys',
    };
    let newState = reducer(stubState, {
      type: actionTypes.EDIT_ARTICLE,
      article: article1,
    });
    expect(newState).toEqual({ ...stubState, articles: [article1] });
    const article2 = {
      id: 3, author_id: 5, title: 'WTWT', content: 'NULL',
    };
    newState = reducer(newState, {
      type: actionTypes.EDIT_ARTICLE,
      article: article2,
    });
    expect(newState).toEqual({ ...stubState, articles: [article1] });
  });

  it('should delete article', () => {
    const newState = reducer(stubState, {
      type: actionTypes.DELETE_ARTICLE,
      id: 0,
    });
    expect(newState).toEqual({ ...stubState, articles: [] });
  });

  it('should get all comments', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_ALL_COMMENTS,
      comments: stubState.comments,
    });
    expect(newState).toEqual({
      user: [],
      articles: [],
      selectedArticle: null,
      comments: stubState.comments,
      selectedComment: null,
    });
  });

  it('should create comment', () => {
    const comment = {
      author_id: 1,
      article_id: 0,
      content: 'Wow!',
      id: 22,
    };
    const newState = reducer(undefined, {
      type: actionTypes.CREATE_COMMENT,
      comment,
    });
    expect(newState).toEqual({
      user: [],
      articles: [],
      selectedArticle: null,
      comments: [comment],
      selectedComment: null,
    });
  });

  it('should edit comment', () => {
    const comment = {
      author_id: 1,
      article_id: 0,
      content: 'WWW',
      id: 22,
    };
    const newState = reducer(stubState, {
      type: actionTypes.EDIT_COMMENT,
      comment,
    });
    expect(newState).toEqual({
      ...stubState,
      comments:
      [stubState.comments[0], stubState.comments[1], stubState.comments[2], comment],
    });
  });

  it('should delete comment', () => {
    const newState = reducer(stubState, {
      type: actionTypes.DELETE_COMMENT,
      id: 22,
    });
    expect(newState).toEqual({
      ...stubState,
      comments:
      [stubState.comments[0], stubState.comments[1], stubState.comments[2]],
    });
  });
});
