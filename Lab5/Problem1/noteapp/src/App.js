import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', color: '#eee7df', imageUrl: ''});
  const [isEditing, setIsEditing] = useState(false);

  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');

  const favoriteNotes = notes.filter(note => note.isFavorite);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleNoteChange = (key, value) => {
    setCurrentNote({
      ...currentNote,
      [key]: value,
    });
  };

  const addNewNote = () => {
    if (!currentNote.title || !currentNote.content) {
      alert('Please add a title and some notes');
      return;
    }
    setNotes([...notes, { ...currentNote, id: Date.now() }]);
    setCurrentNote({ id: null, title: '', content: '', color: '#eee7df' });
  };

  const saveNote = () => {
    setNotes(notes.map(note => (note.id === currentNote.id ? currentNote : note)));
    setCurrentNote({ id: null, title: '', content: '', color: '#eee7df' });
    setIsEditing(false);
  };

  const cancelNote = () => {
    setCurrentNote({ id: null, title: '', content: '', color: '#eee7df' });
    setIsEditing(false);
  };

  const UNSPLASH_ACCESS_KEY = 'QNbNzgGyTVDZyr7n46X5uYwmw7hrMnLk9KG3JsrnwbM';

  const searchUnsplash = async (query) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: query },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
      return [];
    }
  };

  const fetchWeather = async () => {
    const apiKey = '45547b945661e7a3258212b0c7d17529';
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      setWeather(response.data);
      console.log(response.data); // Log to see the response data
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to fetch weather data'); // Display a simple error message
    }
  };

  const toggleFavorite = (noteId) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, isFavorite: !note.isFavorite };
      }
      return note;
    });

    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };



  const editNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    setCurrentNote(noteToEdit);
    setIsEditing(true);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const selectImage = (imageUrl) => {
    setCurrentNote({
      ...currentNote,
      imageUrl: imageUrl
    });
  };

  const handleSearch = async () => {
  const results = await searchUnsplash(query);
    setImages(results);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered notes based on the search query
  const filteredNotes = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
      <div className="note">
        <h2>Note Taking App</h2>

        <input
            type="text"
            placeholder="Search notes"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="search-input"
        />

        <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="get-weather"
        />
        <button onClick={fetchWeather}>Get Weather</button>

        {weather && (
            <div className="weather-display">
              <h3>Weather in {weather.name}</h3>
              <p>{weather.main.temp}°C</p>
              <p>{weather.weather[0].description}</p>
            </div>
        )}

        <div className="note-input">
          <h3>Add A New Note:</h3>
          <div className="note-wrapper">
            <input
                type="text"
                id="note-title"
                placeholder="Title"
                value={currentNote.title}
                onChange={(e) => handleNoteChange('title', e.target.value)}
            />
            <input
                type="text"
                className="image-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for images"
            />
            <button onClick={handleSearch} className="image-search-btn">
              Search
            </button>

            <div className="image-grid">
              {images.map(image => (
                  <img
                      key={image.id}
                      src={image.urls.small}
                      alt={image.description}
                      onClick={() => selectImage(image.urls.small)}
                      style={{ cursor: 'pointer' }}
                  />
              ))}
            </div>
            <textarea
                rows="5"
                placeholder="Text..."
                id="note-content"
                value={currentNote.content}
                onChange={(e) => handleNoteChange('content', e.target.value)}
            />
            <select
                id="notecolor"
                value={currentNote.color}
                onChange={(e) => handleNoteChange('color', e.target.value)}
                className="optionColor"
            >
              <option value="#eee7df">Pearl</option>
              <option value="#DBCBBE">Wafer</option>
              <option value="#B0988E">Del Rio</option>
              <option value="#ABDED7">Aqua</option>
            </select>
            {isEditing ? (
                <>
                  <button type="button" className="btn" onClick={saveNote}>
                    <FontAwesomeIcon icon={faSave} /> Save Note
                  </button>
                  <button type="button" className="btn" onClick={cancelNote}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel Note
                  </button>
                </>
            ) : (
                <button type="button" className="btn" onClick={addNewNote}>
                  <FontAwesomeIcon icon={faPlus} /> Add Note
                </button>
            )}
          </div>

        </div>
        <h2>Favorite Notes</h2>
        <div className="notes-list">
          {favoriteNotes.map(note => (
              <div key={note.id} className="note-item" style={{ backgroundColor: note.color }}>
                <h3>{note.title}</h3>
                {note.imageUrl && <img src={note.imageUrl} alt="Note" />}
                <p>{note.content}</p>
                <div className="note-item-buttons">
                  <button onClick={() => toggleFavorite(note.id)}>
                    Unfavorite
                  </button>
                  <button type="button" className="btn edit-note-btn" onClick={() => editNote(note.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button type="button" className="btn delete-note-btn" onClick={() => deleteNote(note.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                </div>
              </div>
          ))}
        </div>

        <h2>All Notes</h2>
        <div className="note-list">
          {filteredNotes.map((note) => (
              <div key={note.id} className="note-item" style={{ backgroundColor: note.color }}>
                <h3>{note.title}</h3>
                {note.imageUrl && <img src={note.imageUrl} alt="Note" />}
                <p>{note.content}</p>
                <div className="note-item-buttons">
                  <button type="button" className="btn edit-note-btn" onClick={() => editNote(note.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button type="button" className="btn delete-note-btn" onClick={() => deleteNote(note.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                  <button onClick={() => toggleFavorite(note.id)}>
                    {note.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
);
};

export default App;
