import { getOhmsForm, calculateOhms } from "./ohms.js";
import { getResistorsForm, calculateResistors } from "./resistors.js";
import { getPowerForm, calculatePower } from "./power.js";
import {
    getVoltageDividerForm,
    calculateVoltageDivider
} from "./voltage-divider.js";
import {
    getCurrentDividerForm,
    calculateCurrentDivider
} from "./current-divider.js";

const calculators = {
    ohms: {
        title: "Ohm's Law",
        getForm: getOhmsForm,
        calculate: calculateOhms,
        resultId: "ohms-result"
    },
    resistors: {
        title: "Resistors",
        getForm: getResistorsForm,
        calculate: calculateResistors,
        resultId: "resistors-result"
    },
    power: {
        title: "Electrical Power",
        getForm: getPowerForm,
        calculate: calculatePower,
        resultId: "power-result"
    },
    "voltage-divider": {
        title: "Voltage Divider",
        getForm: getVoltageDividerForm,
        calculate: calculateVoltageDivider,
        resultId: "divider-result"
    },
    "current-divider": {
        title: "Current Divider",
        getForm: getCurrentDividerForm,
        calculate: calculateCurrentDivider,
        resultId: "current-divider-result"
    }
};

const dialog = document.querySelector("#calculator-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const calculatorContent = document.querySelector("#calculator-content");
const closeButton = document.querySelector("#close-dialog");

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-calculator]").forEach(button => {
    button.addEventListener("click", () => {
        const calculator = calculators[button.dataset.calculator];

        if (!calculator) {
            return;
        }

        dialogTitle.textContent = calculator.title;
        calculatorContent.innerHTML = calculator.getForm();

        const form = calculatorContent.querySelector("form");

        updateResistorForm(form);

        form.addEventListener("click", event => {
            const actionButton = event.target.closest("[data-action]");

            if (!actionButton) {
                return;
            }

            const list = form.querySelector("[data-resistor-list]");

            if (!list) {
                return;
            }

            const rows = list.querySelectorAll(".resistor-row");

            if (actionButton.dataset.action === "add-resistor") {
                const row = document.createElement("div");
                row.className = "form-field resistor-row";

                const label = document.createElement("label");
                const input = document.createElement("input");
                const removeButton = document.createElement("button");

                label.textContent = "Resistor";
                input.name = "resistances";
                input.type = "number";
                input.min = "0";
                input.step = "any";
                input.required = true;
                input.placeholder = "Enter resistance";

                removeButton.type = "button";
                removeButton.className = "calculate-button";
                removeButton.dataset.action = "remove-resistor";
                removeButton.textContent = "Remove";

                row.append(label, input, removeButton);
                list.appendChild(row);
            }

            if (actionButton.dataset.action === "remove-resistor") {
                if (rows.length <= 2) {
                    return;
                }

                actionButton.closest(".resistor-row").remove();
            }

            updateResistorForm(form);
        });

        form.addEventListener("submit", event => {
            event.preventDefault();

            const resultContainer = document.getElementById(calculator.resultId);
            resultContainer.replaceChildren();

            try {
                const formData = new FormData(form);
                const result = calculator.calculate(formData);

                showResult(resultContainer, result);
            } catch (error) {
                showError(resultContainer, error.message);
            }
        });

        dialog.showModal();
    });
});

function updateResistorForm(form) {
    const list = form.querySelector("[data-resistor-list]");

    if (!list) {
        return;
    }

    const rows = [...list.querySelectorAll(".resistor-row")];

    rows.forEach((row, index) => {
        const label = row.querySelector("label");
        const input = row.querySelector('input[name="resistances"]');
        const removeButton = row.querySelector('[data-action="remove-resistor"]');

        label.textContent = `R${index + 1} (Ω)`;
        input.placeholder = `Enter R${index + 1}`;
        removeButton.disabled = rows.length <= 2;
    });

    const resistorSelect = form.querySelector("#divider-resistor");

    if (resistorSelect) {
        const previousValue = Number(resistorSelect.value);
        resistorSelect.replaceChildren();

        rows.forEach((_, index) => {
            const option = document.createElement("option");
            option.value = String(index + 1);
            option.textContent = `R${index + 1}`;
            resistorSelect.appendChild(option);
        });

        const selectedResistor = Math.min(
            Math.max(previousValue || 1, 1),
            rows.length
        );

        resistorSelect.value = String(selectedResistor);
    }
}

closeButton.addEventListener("click", () => {
    dialog.close();
});

dialog.addEventListener("click", event => {
    if (event.target === dialog) {
        dialog.close();
    }
});

function showResult(container, result) {
    const panel = document.createElement("section");
    panel.className = "result-panel";

    const heading = document.createElement("h3");
    heading.textContent = "Result";

    const value = document.createElement("p");
    value.className = "result-value";
    value.textContent = result.value;

    const formula = document.createElement("p");
    formula.textContent = `Formula: ${result.formula}`;

    const stepsHeading = document.createElement("h3");
    stepsHeading.textContent = "Step-by-step solution";

    const stepsList = document.createElement("ol");

    result.steps.forEach(step => {
        const item = document.createElement("li");
        item.textContent = step;
        stepsList.appendChild(item);
    });

    panel.append(heading, value, formula, stepsHeading, stepsList);
    container.appendChild(panel);
}

function showError(container, message) {
    const error = document.createElement("p");
    error.className = "error-message";
    error.setAttribute("role", "alert");
    error.textContent = message;

    container.appendChild(error);
}