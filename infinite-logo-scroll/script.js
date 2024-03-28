class InfiniteLogoScroll {
    constructor(selector, duration = 10) {
        this.container = document.querySelector(selector);
        this.duration = duration;
        this.init();
    }

    init() {
        this.originalContent = this.container.innerHTML;
        this.container.innerHTML += this.originalContent;
        this.container.innerHTML += this.originalContent;

        requestAnimationFrame(() => {
            const totalWidth = this.container.scrollWidth / 3;
            this.startAnimation(totalWidth);
        });
    }

    startAnimation(totalWidth) {
        const resetAnimation = () => {
            this.container.style.transition = 'none';
            this.container.style.transform = 'translateX(0)';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.startAnimation(totalWidth);
                });
            });
        };

        this.container.style.transition = `transform ${this.duration}s linear`;
        this.container.style.transform = `translateX(-${totalWidth}px)`;

        this.container.addEventListener('transitionend', resetAnimation, { once: true });
    }
}

const partners = new InfiniteLogoScroll('.partners-list', 10);
