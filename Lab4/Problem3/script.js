// Get DOM elements
const noteColour = document.getElementById("notecolor");
const noteListDiv = document.querySelector('.note-list');
let notes = [];
let noteID = 1;

// Note class for representing individual notes with a hierarchical structure
class Note {
    constructor(id, title, content, parent = null) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.parent = parent;
        this.children = [];
    }
}

// Function to set up all event listeners 
function eventListeners() {
    
    // Subscribe to DOMcontentLoaded event to display existing notes
    rxjs.fromEvent(document, 'DOMContentLoaded').subscribe(displayNotes);

    // All Subscribe to click event button
    rxjs.fromEvent(document.getElementById('add-note-btn'), 'click').subscribe(addNewNote);
    rxjs.fromEvent(document.getElementById('save-note-btn'), 'click').subscribe(saveNote);
    rxjs.fromEvent(document.getElementById('cancel-note-btn'), 'click').subscribe(cancelNote);

    rxjs.fromEvent(noteListDiv, 'click')
        .pipe(
            rxjs.operators.filter((e) => e.target.classList.contains('delete-note-btn')),
            rxjs.operators.tap(deleteNote)
        )
        .subscribe();

    rxjs.fromEvent(noteListDiv, 'click')
        .pipe(
            rxjs.operators.filter((e) => e.target.classList.contains('edit-note-btn')),
            rxjs.operators.tap(editNote)
        )
        .subscribe();
}

//Function to add new note
function addNewNote() {
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    // Validate user input
    if (validateInput(noteTitle, noteContent)) {
        let noteItem = new Note(noteID, noteTitle.value, noteContent.value);
        notes.push(noteItem);
        createNote(noteItem);
        noteTitle.value = "";
        noteContent.value = "";
    }
}

// Saving and Change function
function saveNote() {
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const noteIdToEdit = document.getElementById('note-id-holder');

    // Input validation
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

// Validate input function
function validateInput(title, content) {
    if (title.value !== "" && content.value !== "") {
        return true;
    } else {
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

    // If the note had a parent, add it to the parent's children 
    if (noteItem.parent) {
        noteItem.parent.children.push(noteItem);
    }
}

// Function to display existing notes
function displayNotes() {
    if (notes.length > 0) {
        noteID = notes[notes.length - 1].id + 1;
    } else {
        noteID = 1;
    }

    // Create notes in the DOM
    notes.forEach(item => {
        createNote(item);
    });
}


// Function for editing note 
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

//function to delete note
function deleteNote(e) {
    if (e.target.classList.contains('delete-note-btn')) {
        let divID = e.target.parentElement.dataset.id;
        let noteToDelete = notes.find(item => item.id === parseInt(divID));
        
        // Remove the note and its children from the array
        notes = notes.filter(item => !noteToDelete.children.includes(item) && item !== noteToDelete);
        
        // Remove the note from the DOM
        e.target.parentElement.remove();
    }
}

eventListeners();
