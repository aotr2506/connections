const rounds = [
    // Round 1
    {
      words: [
        "Bass", "Lead", "Wind", "Bow",
        "Desert", "Tear", "Minute", "Row",
        "Sow", "Live", "Project", "Contract",
        "Record", "Object", "Present", "Subject"
      ],
      categories: [
        {
          name: "Heteronyms (Set 1)",
          description: "Words spelled the same but pronounced differently, with different meanings.",
          words: ["Bass", "Lead", "Wind", "Bow"],
          color: "#f44336" // Red
        },
        {
          name: "Heteronyms (Set 2)",
          description: "Another set of words spelled the same but pronounced differently.",
          words: ["Desert", "Tear", "Minute", "Row"],
          color: "#2196f3" // Blue
        },
        {
          name: "Nouns and Verbs (Same Pronunciation)",
          description: "Words that function as both nouns and verbs without changing pronunciation.",
          words: ["Project", "Contract", "Record", "Present"],
          color: "#4caf50" // Green
        },
        {
          name: "Words Changing Meaning with Stress Shift",
          description: "Words that change meaning based on syllable stress when spoken.",
          words: ["Object", "Subject", "Sow", "Live"],
          color: "#ff9800" // Orange
        }
      ]
    },
    // Round 2
    {
      words: [
        "Iron", "He", "Spider", "Ant",
        "Widow", "Lantern", "Wonder", "Cat",
        "Witch", "Panther", "Doctor", "Strange",
        "Fate", "Super", "Bat", "Flash"
      ],
      categories: [
        {
          name: "Superheroes with 'Man'",
          description: "Words that combine with 'Man' to form superhero names.",
          words: ["Iron", "Spider", "Ant", "He"],
          color: "#9c27b0" // Purple
        },
        {
          name: "Superheroes with 'Woman' or 'Girl'",
          description: "Words that combine with 'Woman' or 'Girl' to form female superhero names.",
          words: ["Wonder", "Cat", "Super", "Bat"],
          color: "#e91e63" // Pink
        },
        {
          name: "Superheroes Associated with 'Doctor'",
          description: "Words associated with superheroes who have 'Doctor' in their name.",
          words: ["Doctor", "Strange", "Fate", "Flash"],
          color: "#3f51b5" // Indigo
        },
        {
          name: "Superheroes with Color Names",
          description: "Superheroes whose names include a color.",
          words: ["Widow", "Lantern", "Witch", "Panther"],
          color: "#ffeb3b" // Yellow
        }
      ]
    },
    // Round 3
    {
      words: [
        "Head", "Wing", "Spot", "Sun",
        "Exposure", "Enders", "Moon", "Black",
        "Blue", "Park", "Rasp", "Straw",
        "Game", "Thrones", "Iron", "King"
      ],
      categories: [
        {
          name: "Words that Precede 'Berry'",
          description: "Words that can be combined with 'berry' to form fruit names.",
          words: ["Straw", "Rasp", "Black", "Blue"],
          color: "#795548" // Brown
        },
        {
          name: "Terms from 'Game of Thrones'",
          description: "Words associated with the TV show and book series 'Game of Thrones'.",
          words: ["Game", "Thrones", "Iron", "King"],
          color: "#607d8b" // Blue Grey
        },
        {
          name: "Words that Precede 'Light'",
          description: "Words that can be combined with 'light' to form common terms.",
          words: ["Head", "Spot", "Sun", "Moon"],
          color: "#8bc34a" // Light Green
        },
        {
          name: "Titles of Popular TV Shows",
          description: "Words that form titles of well-known TV series when added to the points on a compass.",
          words: ["Park", "Enders", "Wing", "Exposure"],
          color: "#ff5722" // Deep Orange
        }
      ]
    }
  ];
  
  let currentRound = 0;
  let selectedWords = [];
  let matchedCategories = [];
  let timerInterval;
  let totalTime = 5 * 60; // 5 minutes in seconds
  
  function startRound() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    selectedWords = [];
    matchedCategories = [];
  
    // Clear matched categories
    document.getElementById('matched-categories').innerHTML = '';
  
    // Shuffle and display words
    let words = rounds[currentRound].words.slice();
    words.sort(() => Math.random() - 0.5);
  
    words.forEach(word => {
      const cardCol = document.createElement('div');
      cardCol.classList.add('col-6', 'col-md-3');
  
      const card = document.createElement('div');
      card.classList.add('card', 'text-center');
  
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body', 'd-flex', 'align-items-center', 'justify-content-center');
      cardBody.style.height = '100px';
      cardBody.textContent = word;
  
      card.appendChild(cardBody);
      card.addEventListener('click', () => selectWord(card, word));
      cardCol.appendChild(card);
      grid.appendChild(cardCol);
    });
  
    // Start Timer
    startTimer(totalTime, document.getElementById('time'));
  }
  
  function selectWord(card, word) {
    if (selectedWords.includes(word)) {
      selectedWords = selectedWords.filter(w => w !== word);
      card.classList.remove('selected');
    } else if (selectedWords.length < 4) {
      selectedWords.push(word);
      card.classList.add('selected');
      if (selectedWords.length === 4) {
        setTimeout(checkCategory, 300); // Slight delay for user experience
      }
    }
  }
  
  function checkCategory() {
    const categories = rounds[currentRound].categories;
    let foundCategory = null;
    let categoryDescription = '';
    let categoryWords = [];
    let categoryColor = '';
    for (let category of categories) {
      if (arraysEqual(selectedWords.slice().sort(), category.words.slice().sort())) {
        foundCategory = category.name;
        categoryDescription = category.description;
        categoryWords = category.words;
        categoryColor = category.color || '#e8f5e9';
        break;
      }
    }
  
    if (foundCategory && !matchedCategories.includes(foundCategory)) {
      matchedCategories.push(foundCategory);
      // Show modal
      showCategoryModal(foundCategory, categoryDescription);
      moveMatchedWords(foundCategory, categoryWords, categoryColor);
    } else {
      alert('No matching category found.');
    }
  
    // Reset selected words and UI
    selectedWords = [];
    document.querySelectorAll('.card.selected').forEach(card => {
      card.classList.remove('selected');
    });
  
    if (matchedCategories.length === categories.length) {
      endRound();
    }
  }
  
  function moveMatchedWords(categoryName, words, categoryColor) {
    // Remove matched words from the grid
    words.forEach(word => {
      const cardBodies = document.querySelectorAll('#grid .card-body');
      cardBodies.forEach(cardBody => {
        if (cardBody.textContent === word) {
          cardBody.parentElement.parentElement.remove(); // Corrected line
        }
      });
    });
  
    // Create a new section for the matched category
    const matchedCategoriesDiv = document.getElementById('matched-categories');
  
    // Create the category section
    let categorySection = document.createElement('div');
    categorySection.classList.add('matched-category');
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = categoryName;
    categoryTitle.style.color = categoryColor;
    categorySection.appendChild(categoryTitle);
  
    const categoryRow = document.createElement('div');
    categoryRow.classList.add('row', 'justify-content-center');
    categorySection.appendChild(categoryRow);
  
    matchedCategoriesDiv.appendChild(categorySection);
  
    // Add matched words to the category section
    words.forEach(word => {
      const cardCol = document.createElement('div');
      cardCol.classList.add('col-6', 'col-md-3');
  
      const card = document.createElement('div');
      card.classList.add('card', 'text-center');
      card.style.backgroundColor = categoryColor;
      card.style.borderColor = categoryColor;
  
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body', 'd-flex', 'align-items-center', 'justify-content-center');
      cardBody.style.height = '100px';
      cardBody.textContent = word;
      cardBody.style.color = '#fff'; // Set text color to white for contrast
  
      card.appendChild(cardBody);
      cardCol.appendChild(card);
      categoryRow.appendChild(cardCol);
    });
  }
  
  function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  
  function endRound() {
    clearInterval(timerInterval);
    alert('Round Complete!');
    document.getElementById('next-round').style.display = 'block';
  }
  
  function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    timerInterval = setInterval(() => {
      minutes = parseInt(timer / 60);
      seconds = parseInt(timer % 60);
  
      display.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  
      if (--timer < 0) {
        clearInterval(timerInterval);
        alert('Time is up!');
        endRound();
      }
    }, 1000);
  }
  
  function showCategoryModal(title, description) {
    document.getElementById('categoryModalLabel').textContent = `Matched Category: ${title}`;
    document.getElementById('categoryModalBody').textContent = description;
    $('#categoryModal').modal('show'); // Use jQuery to show the modal
  }
  
  document.getElementById('next-round').addEventListener('click', () => {
    currentRound++;
    if (currentRound < rounds.length) {
      document.getElementById('next-round').style.display = 'none';
      startRound();
    } else {
      alert('Game Over!');
    }
  });
  
  // Start the first round when the page loads
  window.onload = startRound;
  
  
  