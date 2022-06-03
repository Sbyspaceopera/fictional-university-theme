class Search {
	// 1. describe and create/initiate our object
	constructor() {
		this.addSearchHTML();
		this.openButton = document.querySelector(".search-trigger");
		this.closeButton = document.querySelector(".search-overlay__close");
		this.searchOverlay = document.querySelector(".search-overlay");
		this.searchField = document.querySelector("#search-term");
		this.resultsDiv = document.querySelector("#search-overlay__results");
		this.isSpinnerVisible = false;
		this.previousValue;
		this.events();
		this.isOverlayOpen = false;
		this.typingTimer;
	}

	// 2. events
	events() {
		this.openButton.addEventListener("click", (e) => this.openOverlay(e));
		this.closeButton.addEventListener("click", () => this.closeOverlay());
		document.body.addEventListener(
			"keydown",
			this.keyPressDispatcher.bind(this)
		);
		document.body.addEventListener("keyup", this.typingLogic.bind(this));
	}

	// 3. methods (function, action...)
	typingLogic() {
		// only perform search if searchfield value changes
		if (this.searchField.value != this.previousValue) {
			clearTimeout(this.typingTimer);

			if (this.searchField.innerHTML === "") {
				if (!this.isSpinnerVisible) {
					this.resultsDiv.innerHTML = `<div class="spinner-loader"></div>`;
					this.isSpinnerVisible = true;
				}
				this.typingTimer = setTimeout(this.getResults.bind(this), 750);
			} else {
				this.resultsDiv.innerHTML = "";
				this.isSpinnerVisible = false;
			}
		}

		this.previousValue = this.searchField.value;
	}

	async getResults() {
		try {
			const response = await fetch(
				`${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.value}`
			);
			const results = await response.json();
			this.resultsDiv.innerHTML = `
            <div class="row">
                <div class="one-third">
                    <h2 class="search-overlay__section-title">General Information</h2>
                    ${
											results.generalInfo.length
												? '<ul class="link-list min-list">'
												: "<p>No general information matches that text</p>"
										}
                    ${results.generalInfo
											.map(
												(item) =>
													`<li><a href="${item.permalink}">${item.title}</a> ${
														item.authorName ? `by ${item.authorName}` : ""
													}  </li>`
											)
											.join("")}
                ${results.generalInfo.length ? "</ul>" : ""}
                </div>
                <div class="one-third">
                    <h2 class="search-overlay__section-title">Programs</h2>
                    ${
											results.programs.length
												? '<ul class="link-list min-list">'
												: `<p>No programs matches that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`
										}
                    ${results.programs
											.map(
												(item) =>
													`<li><a href="${item.permalink}">${item.title}</a></li>`
											)
											.join("")}
                ${results.programs.length ? "</ul>" : ""}
 
                    <h2 class="search-overlay__section-title">Professors</h2>
					${
						results.professors.length
							? '<ul class="link-list min-list">'
							: `<p>No professors matches that search. <a href="${universityData.root_url}/professors">View all professors</a></p>`
					}
                    ${results.professors
											.map(
												(item) =>
													`<li><a href="${item.permalink}">${item.title}</a></li>`
											)
											.join("")}
                ${results.professors.length ? "</ul>" : ""}
                </div>
                <div class="one-third">
                    <h2 class="search-overlay__section-title">Events</h2>
					${
						results.events.length
							? '<ul class="link-list min-list">'
							: `<p>No events matches that search. <a href="${universityData.root_url}/events">View all events</a></p>`
					}
                    ${results.events
											.map(
												(item) =>
													`<li><a href="${item.permalink}">${item.title}</a></li>`
											)
											.join("")}
                ${results.events.length ? "</ul>" : ""}
                </div>
 
            </div> 
                                `;
		} catch (err) {
			this.resultsDiv.innerHTML = `Unexpected Error: ${err}
        `;
		}

		this.isSpinnerVisible = false;
	}

	keyPressDispatcher(e) {
		// S Key && document.querySelector('input textarea').activeElement
		if (e.keyCode === 83 && !this.isOverlayOpen) {
			this.openOverlay();
		}
		// Escape Key
		if (e.keyCode === 27 && this.isOverlayOpen) {
			this.closeOverlay();
		}
	}

	openOverlay(event) {
		event.preventDefault();
		event.stopPropagation();
		this.searchOverlay.classList.add("search-overlay--active");
		// adds css property overflow:hidden
		document.body.classList.add("body-no-scroll");
		// clears search field on overlay open
		this.searchField.innerHTML = "";
		// waits for overlay to fade in before focusing cursur in input field.
		setTimeout(() => this.searchField.focus(), 750);
		this.isOverlayOpen = true;
	}

	closeOverlay() {
		this.searchOverlay.classList.remove("search-overlay--active");
		document.body.classList.remove("body-no-scroll");
		this.isOverlayOpen = false;
	}

	addSearchHTML() {
		document.body.innerHTML += `
      <div class="search-overlay">
 
      <div class="search-overlay__top">
 
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" id="search-term" class="search-term" placeholder="What are you looking for?">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
 
      </div>
 
      <div class="container">
        <div id="search-overlay__results">
        </div>
      </div>
 
    </div>
    `;
	}
}

export default Search;
