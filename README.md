# Personal Portfolio Website

A clean, modern portfolio website inspired by Alan Varghese's design. This single-page website showcases your professional work, skills, and contact information.

## Features

- Responsive design that works on all devices
- Clean and modern user interface
- Projects showcase with detailed information
- Interactive elements with smooth animations
- Contact section to get in touch

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- JavaScript (Vanilla JS)
- Intersection Observer API for scroll animations

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser to view the website
3. Edit the files to customize with your own information:
   - Update personal information in `index.html`
   - Customize colors and styles in `styles.css`
   - Add your own projects in `script.js`

## Customization

### Changing Personal Information

Edit the `index.html` file to replace placeholder text with your own information:

- Name and title in the header section
- About Me section text
- Projects details
- Contact information

### Changing Colors

The website uses CSS variables for easy color customization. Open `styles.css` and modify the following variables in the `:root` selector:

```css
:root {
    --primary-color: #007bff; /* Main accent color */
    --secondary-color: #6c757d; /* Secondary text color */
    --background-color: #f8f9fa; /* Background color */
    --text-color: #212529; /* Main text color */
    --light-gray: #e9ecef; /* Light backgrounds */
    --dark-gray: #343a40; /* Dark text */
}
```

### Adding Projects

Projects are managed in two ways:
1. The first four projects are hard-coded in the HTML
2. Additional projects are added dynamically through JavaScript

To add or modify projects, edit the `additionalProjects` array in `script.js`.

## License

MIT

## Acknowledgments

- Inspired by Alan Varghese's portfolio design
- Font Awesome for icons 