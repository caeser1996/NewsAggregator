import { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';

const SaveSearches = ({ onSelectSearch }) => {
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState(null);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    // Load saved searches from REST API
    fetch('/api/saved-searches')
      .then((response) => response.json())
      .then((data) => setSavedSearches(data));
  }, []);

  const handleDelete = (name) => {
    // Delete saved search from REST API
    fetch(`/api/saved-searches/${name}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => setSavedSearches(data));
    setDeleteModalData(null);
  };

  const handleShowDeleteModal = (name) => {
    setDeleteModalData({ name });
  };

  return (
    <>
      <Button variant="secondary" className="mt-2" onClick={() => setShowSavedSearches(true)}>
        Load Saved Search
      </Button>
      <Modal show={showSavedSearches} onHide={() => setShowSavedSearches(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Saved Searches</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {savedSearches.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Provider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedSearches.map((search) => (
                  <tr key={search.name}>
                    <td>{search.name}</td>
                    <td>{search.provider}</td>
                    <td>
                      <Button variant="primary" onClick={() => onSelectSearch(search)}>
                        Load
                      </Button>{' '}
                      <Button variant="danger" onClick={() => handleShowDeleteModal(search.name)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No saved searches found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSavedSearches(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteModalData} onHide={() => setDeleteModalData(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Saved Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the saved search "{deleteModalData?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalData(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteModalData?.name)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SaveSearches;
