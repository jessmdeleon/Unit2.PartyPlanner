// Constants for cohort and API URL
const COHORT = "2402-ftb-mt-web-pt";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// State object to store events
const state = {
  events: [],
};

// DOM elements
const eventList = document.querySelector("#partyList"); // Event list container
const addEventForm = document.querySelector("#addPartyForm"); // Add event form

// Event listener for submitting the add event form
addEventForm.addEventListener("submit", addEvent);

// Initial rendering of events
render(); // Call render function when the script runs

// Function to fetch events from the API
async function getEvents() {
  try {
    const response = await fetch(API_URL); // Fetch data from API
    const data = await response.json(); // Parse response JSON
    console.log(data); // Log the data to console
    state.events = data.data; // Store events data in state object
    return data; // Return the data
  } catch (error) {
    console.error(error.message); // Log any errors
  }
}

// Function to render events on the page
function renderEvents() {
  if (!state.events.length) {
    // If no events display message
    eventList.innerHTML = "<li>No events scheduled.</li>";
    return;
  }

  eventList.innerHTML = ''; // Clear previous events

  state.events.forEach((event) => {
    // Create list items for each event
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.description}</p>
        <p>${event.date}</p>
        <p>${event.location}</p>
        <button class="deleteButton" data-id="${event.id}">Delete Event</button>
        `;
    eventList.appendChild(li);

    // Attach event listener to delete button
    li.querySelector('.deleteButton').addEventListener('click', () => deleteEvent(event.id));
  });
}

// Function to handle adding an event
async function addEvent(event) {
  event.preventDefault(); // Prevent default form submission

  try {
    const response = await fetch(API_URL, {
      method: "POST", // HTTP POST method
      headers: { "Content-Type": "application/json" }, // JSON content type
      body: JSON.stringify({
        // Convert form data to JSON string
        name: addEventForm.querySelector("#name").value,
        description: addEventForm.querySelector("#description").value,
        date: new Date(addEventForm.querySelector("#date").value).toISOString(), // Corrected date handling
        location: addEventForm.querySelector("#location").value,
      }),
    });

    console.log(response.body); // Log response body
    if (!response.ok) {
      throw new Error("Failed to create event"); // Throw error if response is not ok
    }
    render(); // Render events after successful addition
  } catch (error) {
    console.error(error); // Log any errors
  }
}

// Function to handle deleting an event
async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE", // HTTP DELETE method
      headers: { "Content-Type": "application/json" }, // JSON content type
    });

    console.log(response.body); // Log response body
    if (!response.ok) {
      throw new Error("Failed to delete event"); // Throw error if response is not ok
    }

    render(); // Render events after successful deletion
  } catch (error) {
    console.error(error); // Log any errors
  }
}

// Function to render events on the page
async function render() {
  await getEvents(); // Fetch events from the API
  renderEvents(); // Render the events on the page
}
