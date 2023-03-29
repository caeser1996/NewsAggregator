import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import './NewsAggregator.css';

const NewsAggregator = () => {
    const [articles, setArticles] = useState([]);
    const [sources, setSources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);


    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [selectedAuthors, setSelectedAuthors] = useState('');

    const [selectedSource, setSelectedSource] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        // Fetch the available sources from the selected provider
        let providerUrl = '';
        if (selectedProvider === 'newsapi') {
            providerUrl = `http://localhost:8000/api/news/sources?provider=${selectedProvider}`;
        } else if (selectedProvider === 'guardian') {
            providerUrl = `http://localhost:8000/api/news/sources?provider=${selectedProvider}`;
        }
        axios.get(providerUrl).then((response) => {
            if (selectedProvider === 'newsapi') {
                setSources(response.data.sources);
            } else if (selectedProvider === 'guardian') {
                setSources(response.data.sources);
            }
        });
    }, [selectedProvider]);

    useEffect(() => {
        // Fetch the articles based on the selected source and search query
        if (selectedSource) {
            let articlesUrl = '';
            if (selectedProvider === 'newsapi') {
                articlesUrl = `http://localhost:8000/api/news/search?provider=${selectedProvider}&q=${searchQuery}&sources=${selectedSource}&categories=${selectedCategory}&to=${filterDate}`;
            } else if (selectedProvider === 'guardian') {
                articlesUrl = `http://localhost:8000/api/news/search?provider=${selectedProvider}&q=${searchQuery}&to-date=${filterDate}`;
            }
            setArticles([]);
            axios.get(articlesUrl).then((response) => {
                if (selectedProvider === 'newsapi') {
                    setArticles(response.data.articles.articles);
                } else if (selectedProvider === 'guardian') {
                    setArticles(response.data.articles.response.results);
                }
            });
        }
    }, [selectedSource, selectedProvider, searchQuery, selectedAuthors,filterDate,selectedCategory]);

    useEffect(() => {
        // Fetch the categories and authors based on the selected provider
        let categoriesUrl = '';
        let authorsUrl = '';
        if (selectedProvider === 'newsapi') {
            categoriesUrl = 'http://localhost:8000/api/news/categories?provider=' + selectedProvider;
            authorsUrl = 'http://localhost:8000/api/news/authors?provider=' + selectedProvider;
        } else if (selectedProvider === 'guardian') {
            categoriesUrl = 'http://localhost:8000/api/news/categories?provider=' + selectedProvider;
            authorsUrl = 'http://localhost:8000/api/news/authors?provider=' + selectedProvider;
        }
        axios.get(categoriesUrl)
            .then((categoriesResponse) => {
                if (selectedProvider === 'newsapi') {
                    setCategories(categoriesResponse.data.categories.map((source) => source.name));
                } else if (selectedProvider === 'guardian') {
                    setCategories(categoriesResponse.data.categories.map((source) => source.name));
                }
            })

        axios.get(authorsUrl)
            .then((authorsResponse) => {
                if (selectedProvider === 'newsapi') {
                    setAuthors(authorsResponse.data.authors.map((source) => source));
                } else if (selectedProvider === 'guardian') {
                    setAuthors(Array.from(new Set(Object.values(authorsResponse.data.authors))));
                }
            })
    }, [selectedProvider]);

    const handleProviderChange = (event) => {
        setSelectedProvider('');
        setSelectedSource('');
        setSearchQuery('');
        setFilterDate('');
        setArticles([]);
        setCategories([]);
        setAuthors([]);
        setSelectedProvider(event.target.value);
    
    };

    const handleSourceChange = (event) => {
        setSelectedSource(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (event) => {
        // Filter the articles based on the selected category
        const filteredArticles = articles.filter(
            (article) => article.category === event.target.value
        );
        setSelectedCategory(event.target.value)
        setArticles(filteredArticles);
    };

    const handleAuthorChange = (event) => {
        // Filter the articles based on the selected author
        const filteredArticles = articles.filter(
            (article) => article.author === event.target.value
        );
        setSelectedAuthors(event.target.value)
        setArticles(filteredArticles);
    };

    const handleDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleReset = () => {
        // Reset the selected provider and source, and fetch all the articles
        setSelectedProvider('');
        setSelectedSource('');
        setSearchQuery('');
        setFilterDate('');
        setArticles([]);
        setCategories([]);
        setAuthors([]);

    };

    const filteredArticles = articles.filter((article) => {
        // Filter the articles based on the search query and date filter

        return article
    });

    const personalizedArticles = filteredArticles.filter((article) => {
        // Filter the articles based on the selected categories and authors
        return article
    });
    return (
        <Container className="mt-4">
            <Row>

                <div>
                    <Card>
                        <Card.Body>
                            <Col>
                                <Form>
                                    <Form.Group controlId="providerSelect">
                                        <Form.Label>Select Provider:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={selectedProvider}
                                            onChange={handleProviderChange}
                                        >
                                            <option value="">Select a provider...</option>
                                            <option value="newsapi">NewsAPI</option>
                                            <option value="guardian">The Guardian</option>
                                        </Form.Control>
                                    </Form.Group>
                                    {selectedProvider && (
                                        <Form.Group controlId="sourceSelect">
                                            <Form.Label>Select Source:</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={selectedSource}
                                                onChange={handleSourceChange}
                                            >
                                                <option value="">Select a source...</option>
                                                {sources.map((source) => (
                                                    <option
                                                        key={
                                                            selectedProvider === 'newsapi'
                                                                ? source.id
                                                                : source.id
                                                        }
                                                        value={
                                                            selectedProvider === 'newsapi'
                                                                ? source.id
                                                                : source.id
                                                        }
                                                    >
                                                        {selectedProvider === 'newsapi'
                                                            ? source.id
                                                            : source.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    )}
                                    <Form.Group controlId="searchInput">
                                        <Form.Label>Search Articles:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="dateSelect">
                                        <Form.Label>Filter by Date:</Form.Label>
                                        <Form.Control type="date" onChange={handleDateChange} />
                                    </Form.Group>
                                    <Form.Group controlId="categorySelect">
                                        <Form.Label>Select Category:</Form.Label>
                                        <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
                                            <option value="">All</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="authorSelect">



                                        {selectedProvider === 'newsapi' ? (
                                            <div></div>
                                        ) : (
                                            <div>
                                                <Form.Label>Select Author:</Form.Label>
                                                <Form.Control as="select" value={selectedAuthors} onChange={handleAuthorChange}>
                                                    <option value="">All</option>
                                                    {authors.map((author) => (
                                                        <option key={author} value={author}>
                                                            {author}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </div>

                                        )}

                                    </Form.Group>
                                    <Button variant="primary" className='mt-2' onClick={handleReset}>
                                        Reset
                                    </Button>
                                </Form>
                            </Col>
                        </Card.Body>
                    </Card>

                </div>
                <Col>
                    {selectedProvider === 'newsapi' ? (
                        <ul className="list-group">
                            {personalizedArticles.map((article) => (
                                <li key={article.url} className="list-group-item">
                                    <div>
                                        <a href={article.url}>{article.title}</a>
                                        <br />
                                        <small>
                                            {article.author} | {article.publishedAt}
                                        </small>
                                        <br />
                                        <small>{article.description}</small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="list-group">
                            {personalizedArticles.map((article) => (
                                <div>
                                    <li key={article.webUrl} className="list-group-item">
                                    <div>
                                        <a href={article.webUrl}>{article.webTitle}</a>
                                        <br />
                                        <small>
                                            {article.sectionName} | {article.webPublicationDate}
                                        </small>
                                        <br />
                                        <small>{article.webUrl}</small>
                                    </div>
                                      
                                    </li>
                                </div>
                            ))}
                        </ul>

                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default NewsAggregator;