const note_colour = document.getElementById("notecolor");
const noteListDiv = document.querySelector('.note-list');
let notes = []; //global array to hold all notes.
let noteID = 1; //variable to identify each note. 

//constructor to make note objects.
function Note(id, title, content){
    this.id = id;
    this.title = title;
    this.content = content;
}

// all eventlisteners
function eventListeners(){
    //wont display notes until html is fully loaded. 
    document.addEventListener('DOMContentLoaded', displayNotes);
    document.getElementById('add-note-btn').addEventListener('click', addNewNote);
    document.getElementById('save-note-btn').addEventListener('click', saveNote);
    document.getElementById('cancel-note-btn').addEventListener('click', addNewNote);

    //event listener for the note list which will check if the note is delete or edit button and then call the relevent function. 
    noteListDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-note-btn')) {
            deleteNote(e);
        } else if (e.target.classList.contains('edit-note-btn')) {
            console.log(e);
            editNote(e);
        }
    });
    
}

eventListeners();

// add a new note in the list
function addNewNote(){
    const noteTitle = document.getElementById('note-title'),
          noteContent = document.getElementById('note-content');
    //if statement to check validation.
    if(validateInput(noteTitle, noteContent)){
        //create note object add to list and call createnote.
        let noteItem = new Note(noteID, noteTitle.value, noteContent.value);
        notes.push(noteItem);
        createNote(noteItem);
        noteTitle.value = "";
        noteContent.value = "";
    }
}

// update edited note.
function saveNote(){
    const noteTitle = document.getElementById('note-title'),
          noteContent = document.getElementById('note-content'),
          noteIdToEdit = document.getElementById('note-id-holder');
        
    //checks validation
    if(validateInput(noteTitle, noteContent)){
        //searches array for note with the ID given
        let noteToEdit = notes.find(item => item.id === parseInt(noteIdToEdit.value));
        noteToEdit.title = noteTitle.value;
        noteToEdit.content = noteContent.value;
        //find note with that ID in the HTML
        const noteItem = document.getElementById("note-id-" + noteIdToEdit.value);
        //updates the content of the note
        noteItem.innerHTML = `
        <h3>${noteTitle.value}</h3>
        <p>${noteContent.value}</p>
        <button type="button" class="btn edit-note-btn">
        <span><i class="fas fa-edit"></i></span>
            Edit
        </button>
        <button type = "button" class = "btn delete-note-btn">
        <span><i class = "fas fa-trash"></i></span>
        Remove
        </button>
    `;
        noteTitle.value = "";
        noteContent.value = "";
        //hides the save and cancel button as they aren't needed until the note is being edited
        document.getElementById("save-note-btn").style.display = "none";
        document.getElementById("cancel-note-btn").style.display = "none";
        document.getElementById("add-note-btn").style.display = "inline";
    }
}

// cancel edting of the note
function cancelNote(){
    noteTitle.value = "";
    noteContent.value = "";
    document.getElementById("save-note-btn").style.display = "none";
    document.getElementById("cancel-note-btn").style.display = "none";
    document.getElementById("add-note-btn").style.display = "inline";
}

// input validation to check that the fields aren't empty
function validateInput(title, content){
    if(title.value !== "" && content.value !== ""){
        return true;
    } else {
        if(title.value === "") title.classList.add('warning');
        if(content.value === "") content.classList.add('warning');
    }
    setTimeout(() => {
        title.classList.remove('warning');
        content.classList.remove('warning');
    }, 1500);
}

// create a new note div
function createNote(noteItem){
    const div = document.createElement('div');
    const color = note_colour.value;
    //sets the ID to be the same ID of the note object.
    div.setAttribute('id', 'note-id-' + noteID);
    //increment the global ID for note
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
        <button type = "button" class = "btn delete-note-btn">
        <span><i class = "fas fa-trash"></i></span>
        Remove
        </button>
    `;
    noteListDiv.appendChild(div);
}


// display all the notes 
function displayNotes(){
    if(notes.length > 0){
        noteID = notes[notes.length - 1].id;
        noteID++;
    } else {
        noteID = 1;
    }
    notes.forEach(item => {
        createNote(item);
    });
}

//allows you to do edit note
function editNote(e) {
    if (e.target.classList.contains('edit-note-btn')) {
        //finds the ID of the note from the button that was clicked
        let divID = e.target.parentElement.dataset.id;
        //searches the array to find the note with this ID
        let noteToEdit = notes.find(item => item.id === parseInt(divID));

        document.getElementById('note-title').value = noteToEdit.title;
        document.getElementById('note-content').value = noteToEdit.content;
        document.getElementById('note-id-holder').value = noteToEdit.id;
        //hides the add note button and show the save and cancel buttons
        document.getElementById("save-note-btn").style.display = "inline";
        document.getElementById("cancel-note-btn").style.display = "inline";
        document.getElementById("add-note-btn").style.display = "none";
    }
}

// delete a note 
function deleteNote(e){
    if(e.target.classList.contains('delete-note-btn')){
        // removing from DOM
        e.target.parentElement.remove(); 
    }
}
