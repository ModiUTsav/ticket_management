// Knowledge.jsx
import React, { useState } from 'react';
import './styles/knowledge.css'; // Import the CSS file

const Knowledge = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'How to Reset Your Password',
      content: 'To reset your password, follow these steps:\n1. Go to the login page.\n2. Click on "Forgot Password".\n3. Enter your email address.\n4. Follow the instructions in the email.',
      category: 'Account',
      expanded: false, // Initially collapsed
    },
    {
      id: 2,
      title: 'Troubleshooting Connection Issues',
      content: 'If you are experiencing connection issues, try the following:\n1. Check your internet connection.\n2. Restart your router.\n3. Contact your internet service provider.',
      category: 'Technical',
      expanded: false,
    },
    {
        id: 3,
        title: 'Creating a New Ticket',
        content: 'To create a new ticket, click the "New Ticket" button and fill out the form with details about your issue.',
        category: 'Tickets',
        expanded: false
    },
    {
        id: 4,
        title: 'Understanding Ticket Priorities',
        content: 'Tickets are prioritized as High, Medium, or Low. High priority tickets are addressed first.',
        category: 'Tickets',
        expanded: false
    },
    {
        id: 5,
        title: "Configuring Email Notifications",
        content: "You can customize your email notification preferences in your profile settings.  Choose which events trigger an email.",
        category: 'Account',
        expanded: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleExpand = (id) => {
    setArticles(
      articles.map((article) =>
        article.id === id ? { ...article, expanded: !article.expanded } : article
      )
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

    const filteredArticles = articles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = article.content.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = selectedCategory === 'All' || article.category === selectedCategory;
    return (titleMatch || contentMatch) && categoryMatch;
  });


  const categories = ['All', ...new Set(articles.map(article => article.category))]; // Get unique categories + "All"


  return (
    <div className="knowledge-base">
      <h1>Knowledge Base</h1>

      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="articles-list">
        {filteredArticles.length === 0 ? (
          <p className="no-results">No articles found matching your search.</p>
        ) : (
          filteredArticles.map((article) => (
            <div key={article.id} className="article">
              <h2 className="article-title" onClick={() => toggleExpand(article.id)}>
                {article.title}
                <span className="expand-icon">
                  {article.expanded ? '[-]' : '[+]'}
                </span>
              </h2>
                <p className='article-category'>Category: {article.category}</p>
              {article.expanded && (
                <div className="article-content">
                  <pre>{article.content}</pre> {/* Use <pre> to preserve newlines */}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Knowledge;