
# ElectroCalc

ElectroCalc is a web application for basic electrical engineering calculations. It provides interactive calculators with formulas and step-by-step solutions.

## Features

- **Ohm's Law:** Calculate voltage, current, or resistance.
- **Resistors:** Find equivalent resistance in series or parallel.
- **Electrical Power:** Calculate power, voltage, current, or resistance.
- **Voltage Divider:** Calculate the output voltage of a resistive voltage divider.
- Responsive interface for desktop and mobile screens.
- Step-by-step calculation results.

## Technologies

- HTML5
- CSS3
- JavaScript 

## Getting Started

1. Clone this repository.
2. Open the project folder.
3. Open `index.html` in a modern browser.

If your browser blocks JavaScript modules when opening the file directly, run a local development server from the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```text
ElectroCalc/
├── index.html
├── README.md
├── .gitignore
├── assets/
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── ohms.js
    ├── resistors.js
    ├── power.js
    └── voltage-divider.js
```

## Purpose

This project is being developed as a learning and portfolio project to practice front-end development and apply electrical engineering concepts.

## Future Improvements

- Add more electrical engineering calculators.
- Improve input validation and unit handling.
- Add automated tests.
- Explore a React implementation.
