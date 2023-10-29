// String to represent the API
const apiUrl = 'http://jsonplaceholder.typicode.com/posts';

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

// Will filter data and for each record split the words and check of its greater than the min length 
function filterPostsByTitleLength(posts, minLength) {
  return posts.filter(post => post.title.split(' ').length > minLength);
}

// Will counts all of the words in the data
function buildWordFrequencyMap(texts) {
  return texts
    .flatMap(text => text.split(/\s+/))
    .map(word => word.toLowerCase().replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, ''))
    .filter(word => word.length > 0)
    .reduce((map, word) => {
      map.set(word, (map.get(word) || 0) + 1);
      return map;
    }, new Map());
}

// Will create HTML lists based on the data given
function createListItems(data, elementId) {
  const container = document.getElementById(elementId);
  if (container) {
    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      container.appendChild(listItem);
    });
  }
}

// Main function that will run when the page is loaded 
async function main() {
  try {
    const data = await fetchJson(apiUrl);

    // Filters all titles and return all that have higher word count than 6
    const filteredPosts = filterPostsByTitleLength(data, 6);

    // Create a lists of all filter titles
    createListItems(filteredPosts.map(post => post.title), 'titlesList');

    // Mapping the post body to the viriable and counting the words 
    const bodyContents = data.map(post => post.body);
    const wordFrequencyMap = buildWordFrequencyMap(bodyContents);

    // Create a lists of all filter titles
    createListItems(
      Array.from(wordFrequencyMap).map(([word, count]) => `${word}: ${count}`),
      'wordFrequencyList'
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();