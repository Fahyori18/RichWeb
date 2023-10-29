let contacts = []; //global array to hold all contact list.
let isAscending = true; 

// Adds values from fields and creates a contact when  button is clicked
document.getElementById("add-contact").addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();

    // Makes sure that all inputs are valid before it creates the contact and adds it to the array
    if (validateInput(name, mobile, email)) {
        const contact = {
            name,
            mobile,
            email,
        };
        contacts.push(contact);
        addContactToTable(contact);
        resetFields();
    }
});

// Will check all string from fields via regex then returen true or false
function validateInput(name, mobile, email) {
    const nameValidation = /^[A-Za-z\s]{1,20}$/; // Will make sure the string is just alphabetical and must be a size of 1-20
    const mobileValidation = /^\d{10}$/; // Will make sure the string is digit and make sure it a length 10
    const emailValidation = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/; // Makes sure that email is alphanumeric with an @ symbol in the middle follow by a period and the last part must be alphabetical with the lenght of 2-4 characters.

    // Create error div to the page if the input is invalid.
    const errorDiv = document.getElementById("error");
    if (!name.match(nameValidation) || !mobile.match(mobileValidation) || !email.match(emailValidation)) {
        errorDiv.innerText = "Invalid input. Please check the fields.";
        errorDiv.style.display = "block";
        return false;
    } else {
        errorDiv.style.display = "none";
        return true;
    }
}

// Adds contact to html table 
function addContactToTable(contact) {
    const table = document.getElementById("contact-table").getElementsByTagName("tbody")[0];
    const row = table.insertRow(table.rows.length);
    const nameCell = row.insertCell(0);
    const mobileCell = row.insertCell(1);
    const emailCell = row.insertCell(2);

    nameCell.innerHTML = contact.name;
    mobileCell.innerHTML = contact.mobile;
    emailCell.innerHTML = contact.email;

    // Apply background color to odd rows
    if (table.rows.length % 2 === 1) {
        row.style.backgroundColor = "#f2f2f2";
    }
}

// Makes field blank after add contact
function resetFields() {
    document.getElementById("name").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("email").value = "";
}

// Sort table base on name in Ascending or Decending order
function sortTableByName() {
    const column = 0;
    const table = document.getElementById("contact-table").getElementsByTagName("tbody")[0];
    const rows = Array.from(table.rows);

    //A loop through every rows on the table and sorts them by comparing instance A to instance B
    rows.sort((a, b) => {
        const nameA = a.cells[column].innerHTML;
        const nameB = b.cells[column].innerHTML;

        if (isAscending) {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    // Removes every element from the table 
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // Readds the sorted rows to the table 
    rows.forEach((row, index) => {
        console.log(index);
        table.appendChild(row);
        // Apply background color to odd rows based on the new order
        if (index % 2 === 1) {
            row.style.backgroundColor = "";
        } else {
            row.style.backgroundColor = "#f2f2f2"; // Reset the background color
        }
    });

    // Swap is ascending to negative
    isAscending = !isAscending;
}

// Checks if theres any change to the search bar and if so queries tables
document.getElementById("search").addEventListener("input", function () {
    const searchTerm = document.getElementById("search").value.trim();
    const table = document.getElementById("contact-table").getElementsByTagName("tbody")[0];
    const rows = Array.from(table.rows);

    // Iterates through the rows, if a row matches the search otherwise hidden
    rows.forEach((row) => {
        const mobile = row.cells[1].innerHTML;
        if (mobile.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    //shows a no result div to notify the user
    const noResultDiv = document.getElementById("noResult");
    if (rows.every((row) => row.style.display === "none")) {
        noResultDiv.style.display = "block";
    } else {
        noResultDiv.style.display = "none";
    }
});
