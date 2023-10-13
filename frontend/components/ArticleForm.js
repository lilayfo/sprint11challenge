
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  const {
    currentArticleId,
    articles,
    setCurrentArticleId,
    updateArticle,
    postArticle,
  } = props;

  useEffect(() => {
    setValues(initialFormValues);
  }, []);

  useEffect(() => {
    if (currentArticleId) {
      const currentArticle = articles.find((art) => art.article_id === currentArticleId);
      if (currentArticle) {
        setValues(currentArticle);
      } else {
        setValues(initialFormValues);
      }
    }
  }, [currentArticleId, articles]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };



  const onSubmit = (evt) => {
    evt.preventDefault();
    if (isDisabled()){
      return;
    }
    if (currentArticleId) {
      const data = {
        article_id: currentArticleId,
        article: values,
      };
      updateArticle(data).then(() => {
        setValues(initialFormValues); 
      });
    } else {
      postArticle(values).then(() => {
        setValues(initialFormValues); 
      });
    }
  };
  

  const isDisabled = () => {
    return !(values.title && values.text && values.topic);
  };

  const cancel = (e) => {
    e.preventDefault();
    setCurrentArticleId();
    setValues(initialFormValues);
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticleId ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          Submit
        </button>
        {currentArticleId && (
          <button onClick={cancel}>Cancel edit</button>
        )}
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  postArticle: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  setCurrentArticleId: PropTypes.func.isRequired,
  currentArticleId: PropTypes.number,
  articles: PropTypes.arrayOf(PropTypes.shape({
    article_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
  })).isRequired,
};

