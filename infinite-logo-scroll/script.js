class InfiniteLogoScroll {
    constructor(selector, duration = 10, direction = 'left', pauseOnHover = false) {
        this.container = document.querySelector(selector);
        this.duration = duration;
        this.direction = direction;
        this.pauseOnHover = pauseOnHover;
        this.isPaused = false;
        this.init();
    }

    init() {
        this.originalContent = this.container.innerHTML;
        this.container.innerHTML += this.originalContent + this.originalContent;

        if (this.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAnimation());
            this.container.addEventListener('mouseleave', () => this.resumeAnimation());
        }

        requestAnimationFrame(() => {
            const totalWidth = this.container.scrollWidth / 3;

            if (this.direction === 'right') {
                this.container.style.marginLeft = `-${totalWidth}px`;
            } else {
                this.container.style.marginLeft = `0px`;
            }

            this.startAnimation(totalWidth);
        });
    }

    startAnimation(totalWidth) {
        const resetAnimation = () => {
            this.container.style.transition = 'none';
            if (this.direction === 'right') {
                this.container.style.marginLeft = `-${totalWidth}px`;
                this.container.style.transform = 'translateX(0)';
            } else {
                this.container.style.marginLeft = `0px`;
                this.container.style.transform = 'translateX(0)';
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!this.isPaused) {
                        this.startAnimation(totalWidth);
                    }
                });
            });
        };

        console.log('startAnimation');
        console.log('duration', this.duration);
        this.container.style.transition = `transform ${this.duration}s linear`;

        if (this.direction === 'right') {
            this.container.style.transform = `translateX(${totalWidth}px)`;
        } else {
            this.container.style.transform = `translateX(-${totalWidth}px)`;
        }

        this.container.addEventListener('transitionend', resetAnimation, { once: true });
    }

    pauseAnimation() {
        if (!this.isPaused) {
            this.isPaused = true;
            const computedStyle = window.getComputedStyle(this.container);
            const matrix = new WebKitCSSMatrix(computedStyle.transform);
            this.container.style.transform = `translateX(${matrix.m41}px)`;
            this.container.style.transition = 'none';
        }
    }

    resumeAnimation() {
        if (this.isPaused) {
            this.isPaused = false;
            const totalWidth = this.container.scrollWidth / 3;
            const computedStyle = window.getComputedStyle(this.container);
            const matrix = new WebKitCSSMatrix(computedStyle.transform);
            const remainingDistance = (this.direction === 'right')
                ? totalWidth - Math.abs(matrix.m41)
                : totalWidth + matrix.m41;

            const remainingDuration = Math.max((remainingDistance / totalWidth) * this.duration, 0.1);

            requestAnimationFrame(() => {
                this.container.style.transition = `transform ${remainingDuration}s linear`;
                if (this.direction === 'right') {
                    this.container.style.transform = `translateX(${totalWidth}px)`;
                } else {
                    this.container.style.transform = `translateX(-${totalWidth}px)`;
                }
            });

            this.container.addEventListener('transitionend', () => {
                this.container.style.transition = 'none';
                if (this.direction === 'right') {
                    this.container.style.transform = `translateX(-${totalWidth}px)`;
                } else {
                    this.container.style.transform = `translateX(0px)`;
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (!this.isPaused) {
                            this.startAnimation(totalWidth);
                        }
                    });
                });
            }, { once: true });
        }
    }
}

// Utilisation
// const partners = new InfiniteLogoScroll('.partners-list', 10, 'left', true);  // Défilement avec pause au hover activée
// const partners = new InfiniteLogoScroll('.partners-list', 10, 'right', true); // Défilement droite vers gauche avec pause au hover activée
