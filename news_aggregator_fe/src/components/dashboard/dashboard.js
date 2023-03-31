import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import SaveSearches from '../saveSearch/SaveSearches';
import './NewsAggregator.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(true);
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
    const [page, setPage] = useState(1); // Initialize the page to 1
    const [pageSize, setPageSize] = useState(10); // Set the default page size to 10
    const [savedSearchName, setSavedSearchName] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);


    useEffect(() => {
        const udata = localStorage.getItem('user');
        if (udata === null) {
            setLoggedIn(false);
        } else {
            const odata = JSON.parse(udata);
            setUser(odata.user);
        }
    }, []);
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
        // Fetch the articles based on the selected source, search query, and page number
        if (selectedProvider) {
            let articlesUrl = '';
            if (selectedProvider === 'newsapi') {
                articlesUrl = `http://localhost:8000/api/news/search?provider=${selectedProvider}&q=${searchQuery}&sources=${selectedSource}&categories=${selectedCategory}&to=${filterDate}&pageSize=${pageSize}&page=${page}`;
            } else if (selectedProvider === 'guardian') {
                articlesUrl = `http://localhost:8000/api/news/search?provider=${selectedProvider}&q=${searchQuery}&to-date=${filterDate}&pageSize=${pageSize}&page=${page}`;
            }
            else {
                articlesUrl = `http://localhost:8000/api/news/search?provider=${selectedProvider}&q=${searchQuery}&to-date=${filterDate}&pageSize=${pageSize}&page=${page}`;
            }
            axios.get(articlesUrl).then((response) => {
                if (selectedProvider === 'newsapi') {
                    setArticles([...articles, ...response.data.articles.articles]);
                } else if (selectedProvider === 'guardian') {
                    setArticles([...articles, ...response.data.articles.response.results]);
                }
                else if (selectedProvider === 'nytimes') {
                    setArticles([...articles, ...response.data.articles.response.docs]);
                }
            });
        }
    }, [selectedSource, selectedProvider, searchQuery, selectedAuthors, filterDate, selectedCategory, page, pageSize]);

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
    if (!loggedIn) {
        return <Navigate to="/sign-in" />;
    }
    const handleProviderChange = (event) => {
        setSelectedProvider('');
        setSelectedSource('');
        setSearchQuery('');
        setFilterDate('');
        setArticles([]);
        setCategories([]);
        setAuthors([]);
        setSelectedProvider(event.target.value);
        setPage(1); // Reset the page to 1 when changing the provider
    };

    const handleSourceChange = (event) => {
        setSelectedSource(event.target.value);
        setPage(1); // Reset the page to 1 when changing the source
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    function handleSelectSearch(search) {
        // Do something with the selected search
        console.log(search)
    }
    const handleCategoryChange = (event) => {
        // Filter the articles based on the selected category
        setSelectedCategory(event.target.value)
        setPage(1); // Reset the page to 1 when changing the category
    };

    const handleAuthorChange = (event) => {
        // Filter the articles based on the selected author
        setSelectedAuthors(event.target.value)
        setPage(1); // Reset the page to 1 when changing the author
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
        setPage(1); // Reset the page to 1 when resetting
    };

    const filteredArticles = articles.filter((article) => {
        // Filter the articles based on the search query and date filter
        return article;
    });

    const personalizedArticles = filteredArticles.filter((article) => {
        // Filter the articles based on the selected categories and authors
        return article;
    });

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value)); // Update the page size
    }

    const handleScroll = () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            setPage(page + 1); // Load more articles when scrolling to the bottom of the page
        }
    }

    const loadMore = () => {
        setPage(page + 1);
    };


    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/dashboard">
                        News Aggr
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/dashboard">
                                    Home
                                </a>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <a className="nav-link" href="/logout">
                                logout
                            </a>
                        </ul>
                    </div>
                </div>
            </nav>

            <Container fluid>
                <Row>
                    <Col className='mt-3' md={2}>
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
                                                    <option value="nytimes">NYTIMES</option>
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
                                            <Form.Group controlId="pageSizeSelect">
                                                <Form.Label>Page Size:</Form.Label>
                                                <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
                                                    {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
                                                        <option key={value} value={value}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button variant="primary" className='mt-2' onClick={handleReset}>
                                                Reset
                                            </Button>
                                            <Button variant="primary" className='mt-2 mx-2' onClick={() => setShowSaveModal(true)}>
                                                Save Search
                                            </Button>
                                            <SaveSearches onSelectSearch={handleSelectSearch} />
                                        </Form>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                    <Col className='mt-3' md={10}>
                        {selectedProvider === 'newsapi' ? (
                            <ul className="list-group">
                                {personalizedArticles.slice(0, page * pageSize).map((article) => (
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
                        ) : selectedProvider === 'nytimes' ? (
                            <ul className="list-group">
                                {personalizedArticles.slice(0, page * pageSize).map((article) => (
                                    <div>
                                        <li key={article.web_url} className="list-group-item">
                                            <div>
                                                <a href={article.web_url}>{article.headline.main}</a>
                                                <br />
                                                <small>
                                                    {article.section_name} | {article.pub_date}
                                                </small>
                                                <br />
                                                <small>{article.web_url}</small>
                                            </div>
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <ul className="list-group">
                                {personalizedArticles.slice(0, page * pageSize).map((article) => (
                                    <div>
                                        <li key={article._id} className="list-group-item">
                                            <div>
                                                <a href={article.web_url}>{article.headline.main}</a>
                                                <br />
                                                <small>
                                                    {article.source} | {article.pub_date}
                                                </small>
                                                <br />
                                                <small>{article.snippet}</small>
                                            </div>
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </Col>
                    <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Save Search</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                                type="text"
                                placeholder="Enter a name for your saved search"
                                value={savedSearchName}
                                onChange={(e) => setSavedSearchName(e.target.value)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    // save the search to local storage
                                    const savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || {};
                                    savedSearches[savedSearchName] = {
                                        provider: selectedProvider,
                                        source: selectedSource,
                                        query: searchQuery,
                                        date: filterDate,
                                        category: selectedCategory,
                                        author: selectedAuthors,
                                        pageSize: pageSize,
                                    };
                                    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
                                    // close the modal and reset the saved search name
                                    setShowSaveModal(false);
                                    setSavedSearchName('');
                                }}
                            >
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </Row>

            </Container>
        </div>
    );
};

export default Dashboard;
