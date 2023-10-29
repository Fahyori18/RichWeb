// String to represent the API being use
const apiUrl = 'https://api.github.com/users/';
// Two variable to represent the 2 column
const userProfile = document.getElementById("user-profile");
const repoDetails = document.getElementById("repo-details");

// Generic function to fecth data from an API
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Function to update the HTML with the new data
async function updateData(username) {
  try {

    // Find user in Github
    const userData = await fetchJson(apiUrl + username);

    // If a result had been returned will display the data otherwise will say no user found
    if(userData){
        userProfile.innerHTML = `
            <h1>User Profile</h1>
            <img src="${userData.avatar_url}" alt="Avatar" class="avatar">
            <div class="info">
                <div class="info-row">
                    <span class="info-title">Name:</span>
                    <p id="info-name">${userData.name}</p>
                </div>
                <div class="info-row">
                    <span class="info-title">Username:</span> 
                    <p id="info-username">${userData.login}</p>
                </div>
                <div class="info-row">
                    <span class="info-title">Email:</span> 
                    <p id="info-email">${userData.email}</p>
                </div>
                <div class="info-row">
                    <span class="info-title">Location:</span>
                    <p id="info-location">${userData.location}</p>
                </div>
                <div class="info-row">
                    <span class="info-title">Number of Gists:</span>
                    <p id="info-gists">${userData.public_gists}</p>
                </div>
            </div>
        `;

        // Searches the repos of the user 
        const userRepos = await fetchJson(apiUrl + username + "/repos");

        // Checks if theres more than 5 repos if there are will add a scroll bar to the column
        if (userRepos.length > 5) {

          // Maps all repos to the HTML divs
            repoDetails.innerHTML = `
            <h1>User Repos</h1>
            <div class="repo-list">
                ${userRepos.map(repo => `
                <div class="repo">
                    <a href="${repo.html_url}" class="repo-title">Name: ${repo.name}</a>
                    <div class="repo-description">${repo.description}</div>
                </div>
                `).join('')}
            </div>
            `;
        
            // Added max-height to enable scrolling
            const repoList = document.querySelector('.repo-list');
            repoList.style.maxHeight = '250px'; // Adjust the height as needed
        } 
        else {
            repoDetails.innerHTML = `
            <h1>User Repos</h1>
            ${userRepos.map(repo => `
                <div class="repo">
                    <a href="${repo.html_url}" class="repo-title">Name: ${repo.name}</a>
                    <div class="repo-description">${repo.description}</div>
                </div>
            `).join('')}
            `;
        };
    }
    else{
        userProfile.innerHTML = "<h1>No User Found</h1>"; 
        repoDetails.innerHTML = "";
    }


  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Checks to see when the search button was clicked and if so will call a function which will query the AIP and populate the HTMl
document.getElementById("search-button").addEventListener("click", () => {
    const username = document.getElementById("search").value;

    if (username) {
        updateData(username);
    }
});
