class Summary {
    constructor(container, richtext, titles = 'h3') {
        this.container = document.querySelector(container);
        this.item = this.container ? this.container.firstElementChild : null;
        this.richtext = document.querySelector(richtext);
        this.titles = titles;

        if (!this.container) return console.error('[Summary] container not found');
        if (!this.item) return console.error('[Summary] first item not found in container');
        if (!this.richtext) return console.error('[Summary] richtext not found');

        this.items = []; // Store references to the summary items
        this.headers = []; // Store references to the headers

        this.init();
    }

    init() {
        // Get all h3 elements in the richtext container
        const headers = this.richtext.querySelectorAll(this.titles);
        if (headers.length === 0) return console.warn('[Summary] No h3 elements found in the richtext');

        // Clear the container but keep the first item for cloning
        this.container.innerHTML = '';

        headers.forEach((header, index) => {
            // Clone the first item
            const itemClone = this.item.cloneNode(true);

            // Replace the {{text}} placeholder with the header's text
            itemClone.innerHTML = itemClone.innerHTML.replace('{{text}}', header.textContent);

            // Set the event listener for clicking to scroll to the header
            itemClone.addEventListener('click', () => {
                header.scrollIntoView({
                    behavior: 'smooth'
                });
            });

            // Append the cloned item to the container
            this.container.appendChild(itemClone);

            // Store the item and header references
            this.items.push(itemClone);
            this.headers.push(header);
        });

        // Add scroll event listener to track which section is in view
        window.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        let currentIndex = -1;
        const scrollPosition = window.scrollY + window.innerHeight / 4; // Adjust the offset as needed

        this.headers.forEach((header, index) => {
            const headerTop = header.offsetTop;
            const nextHeaderTop = this.headers[index + 1] ? this.headers[index + 1].offsetTop : Infinity;

            // Check if the current scroll position is between the current header and the next one
            if (scrollPosition >= headerTop && scrollPosition < nextHeaderTop) {
                currentIndex = index;
            }
        });

        // Update the active class on the corresponding summary item
        this.items.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Utilisation
// new Summary('.summary-list', '.richtext', 'h2');