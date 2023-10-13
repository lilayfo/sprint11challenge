import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axios from 'axios';
import { axiosWithAuth } from '../axios';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    setArticles([]);
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    const credentials = {
      username: username,
      password: password,
    };
    setSpinnerOn(true);
    axios
      .post(loginUrl, credentials)
      .then(({ data }) => {
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        setMessage('Error: please try again');
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then(({ data }) => {
        setMessage(data.message);
        setArticles(data.articles);
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then(({ data }) => {
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.error(err);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then(({ data }) => {
        setMessage(data.message);
        setCurrentArticleId();
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.error(err);
      });
  };

  const deleteArticle = (article_id) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then(({ data }) => {
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.error(err);
        setSpinnerOn(false);
      });
  };

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  currentArticleId={currentArticleId}
                  articles={articles}
                  setCurrentArticleId={setCurrentArticleId}
                  updateArticle={updateArticle}
                  postArticle={postArticle}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  setCurrentArticleId={setCurrentArticleId}
                  deleteArticle={deleteArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
