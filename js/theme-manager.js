/**
 * Theme Manager Module
 * Handles dark mode functionality across all pages
 * Manages localStorage persistence and system preference detection
 */

const ThemeManager = {
    // Cache DOM elements
    darkModeToggle: null,
    toggleIcon: null,
    body: null,

    /**
     * Initialize the theme manager
     * Should be called on page load
     */
    init() {
        // Get DOM elements
        this.darkModeToggle = document.getElementById('dark-mode-toggle');
        this.toggleIcon = document.querySelector('.toggle-icon');
        this.body = document.body;

        if (!this.darkModeToggle || !this.toggleIcon) {
            console.warn('Theme manager: Required elements not found');
            return;
        }

        // Apply initial theme
        const currentTheme = this.getPreferredTheme();
        this.applyTheme(currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Add toggle click handler
        this.darkModeToggle.addEventListener('click', () => {
            const newTheme = this.body.classList.contains('dark-mode') ? 'light' : 'dark';
            this.applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    },

    /**
     * Get the preferred theme from localStorage or system preference
     * @returns {string} 'dark' or 'light'
     */
    getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    /**
     * Apply a theme to the page
     * @param {string} theme - 'dark' or 'light'
     */
    applyTheme(theme) {
        if (theme === 'dark') {
            this.body.classList.add('dark-mode');
            this.toggleIcon.textContent = '☀️';
        } else {
            this.body.classList.remove('dark-mode');
            this.toggleIcon.textContent = '🌙';
        }
    }
};
