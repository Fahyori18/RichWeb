// Get DOM elements
const noteColour = document.getElementById("notecolor");
const noteListDiv = document.querySelector('.note-list');
let notes = [];
let noteID = 1;

// Constructor function for creating Note objects 
function Note(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
}

// Function to set up all event listeners 
function eventListeners() {
    // Subscribe to DOMcontentLoaded event to display existing notes
    rxjs.fromEvent(document, 'DOMContentLoaded').subscribe(displayNotes);

    // Subscribe to click event on add note button
    rxjs.fromEvent(document.getElementById('add-note-btn'), 'click').subscribe(addNewNote);

    // Subscribe to click event to save note button 
    rxjs.fromEvent(document.getElementById('save-note-btn'), 'click').subscribe(saveNote);

    // Subscribe to click event cancel button
    rxjs.fromEvent(document.getElementById('cancel-note-btn'), 'click').subscribe(cancelNote);

    // Subscribe to click event on Delete note button 
    rxjs.fromEvent(noteListDiv, 'click')
        .pipe(
            rxjs.operators.filter((e) => e.target.classList.contains('delete-note-btn')),
            rxjs.operators.tap(deleteNote)
        )
        .subscribe();

    // Subscribe to click event on edit note button
    rxjs.fromEvent(noteListDiv, 'click')
        .pipe(
            rxjs.operators.filter((e) => e.target.classList.contains('edit-note-btn')),
            rxjs.operators.tap(editNote)
        )
        .subscribe();
}

// Add new note function
function addNewNote() {

    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    // Checking validation 
    if (validateInput(noteTitle, noteContent)) {
        //  Create note object add to list and call createnote.
        let noteItem = new Note(noteID, noteTitle.value, noteContent.value);
        notes.push(noteItem);
        createNote(noteItem);
        noteTitle.value = "";
        noteContent.value = "";
    }
}

//  Update and edit note function
function saveNote() {

    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const noteIdToEdit = document.getElementById('note-id-holder');

    // Checks validation
    if (validateInput(noteTitle, noteContent)) {
        let noteToEdit = notes.find(item => item.id === parseInt(noteIdToEdit.value));

        noteToEdit.title = noteTitle.value;
        noteToEdit.content = noteContent.value;

        // Update the note in the DOM
        const noteItem = document.getElementById("note-id-" + noteIdToEdit.value);
        noteItem.innerHTML = `
            <h3>${noteTitle.value}</h3>
            <p>${noteContent.value}</p>
            <button type="button" class="btn edit-note-btn">
                <span><i class="fas fa-edit"></i></span>
                Edit
            </button>
            <button type="button" class="btn delete-note-btn">
                <span><i class="fas fa-trash"></i></span>
                Remove
            </button>
        `;

        // Clear input field and update button visiblity 
        noteTitle.value = "";
        noteContent.value = "";
        document.getElementById("save-note-btn").style.display = "none";
        document.getElementById("cancel-note-btn").style.display = "none";
        document.getElementById("add-note-btn").style.display = "inline";
    }
}

// Function to cancel note 
function cancelNote() {
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    noteTitle.value = "";
    noteContent.value = "";
    document.getElementById("save-note-btn").style.display = "none";
    document.getElementById("cancel-note-btn").style.display = "none";
    document.getElementById("add-note-btn").style.display = "inline";
}

// Function to validate input
function validateInput(title, content) {
    if (title.value !== "" && content.value !== "") {
        return true;
    } else {
        // Add warning classes and remove them after a delay
        if (title.value === "") title.classList.add('warning');
        if (content.value === "") content.classList.add('warning');
    }

    setTimeout(() => {
        title.classList.remove('warning');
        content.classList.remove('warning');
    }, 1500);

    return false;
}

// Function to create a new note in the DOM
function createNote(noteItem) {
    const div = document.createElement('div');
    const color = noteColour.value;

    div.setAttribute('id', 'note-id-' + noteID);
    noteID++;
    div.classList.add('note-item');
    div.setAttribute('data-id', noteItem.id);
    div.style.backgroundColor = color;
    div.innerHTML = `
        <h3>${noteItem.title}</h3>
        <p>${noteItem.content}</p>
        <button type="button" class="btn edit-note-btn">
            <span><i class="fas fa-edit"></i></span>
            Edit
        </button>
        <button type="button" class="btn delete-note-btn">
            <span><i class="fas fa-trash"></i></span>
            Remove
        </button>
    `;
    noteListDiv.appendChild(div);
}

// Function to display existing note 
function displayNotes() {

    // Set the initial notID based on existing notes
    if (notes.length > 0) {
        noteID = notes[notes.length - 1].id + 1;
    } else {
        noteID = 1;
    }

    // Create note in the DOM
    notes.forEach(item => {
        createNote(item);
    });
}

// Function to handle editing note
function editNote(e) {
    if (e.target.classList.contains('edit-note-btn')) {
        let divID = e.target.parentElement.dataset.id;
        let noteToEdit = notes.find(item => item.id === parseInt(divID));

        //Populate input fields with note data
        document.getElementById('note-title').value = noteToEdit.title;
        document.getElementById('note-content').value = noteToEdit.content;
        document.getElementById('note-id-holder').value = noteToEdit.id;

        // Update button visibility
        document.getElementById("save-note-btn").style.display = "inline";
        document.getElementById("cancel-note-btn").style.display = "inline";
        document.getElementById("add-note-btn").style.display = "none";
    }
}

// Function to delete note
function deleteNote(e) {
    if (e.target.classList.contains('delete-note-btn')) {
        let divID = e.target.parentElement.dataset.id;
        notes = notes.filter(item => item.id !== parseInt(divID));
        e.target.parentElement.remove();
    }
}

eventListeners();