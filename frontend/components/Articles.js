import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Articles(props) {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate('/');
  };

  const { articles, getArticles, setCurrentArticleId, deleteArticle } = props;

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return redirectToLogin();
    }
    if (articles.length === 0) {
      getArticles();
    }
  }, [articles, getArticles]);

  function isAuthorized() {
    const token = localStorage.getItem('token');
    return !token;
  }

  return (
    <div className="articles">
      <h2>Articles</h2>
      {articles.length === 0 ? (
        'No articles yet'
      ) : (
        articles.map((art) => (
          <div className="article" key={art.article_id}>
            <div>
              <h3>{art.title}</h3>
              <p>{art.text}</p>
              <p>Topic: {art.topic}</p>
            </div>
            <div>
              <button
                disabled={isAuthorized()}
                onClick={() => setCurrentArticleId(art.article_id)}
              >
                Edit
              </button>
              <button
                disabled={isAuthorized()}
                onClick={() => deleteArticle(art.article_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

Articles.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      article_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      topic: PropTypes.string.isRequired,
    })
  ).isRequired,
  getArticles: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func.isRequired,
  setCurrentArticleId: PropTypes.func.isRequired,
  currentArticleId: PropTypes.number,
};
