
export function getOhmsForm() {
    return `
        <form class="calculator-form" id="ohms-form">
            <div class="form-field">
                <label for="ohms-target">Calculate</label>
                <select id="ohms-target" name="target">
                    <option value="voltage">Voltage (V)</option>
                    <option value="current">Current (I)</option>
                    <option value="resistance">Resistance (R)</option>
                </select>
            </div>

            <div class="form-field">
                <label for="ohms-current">Current (A)</label>
                <input id="ohms-current" name="current" type="number" min="0" step="any" placeholder="Enter current">
            </div>

            <div class="form-field">
                <label for="ohms-resistance">Resistance (Ω)</label>
                <input id="ohms-resistance" name="resistance" type="number" min="0" step="any" placeholder="Enter resistance">
            </div>

            <div class="form-field">
                <label for="ohms-voltage">Voltage (V)</label>
                <input id="ohms-voltage" name="voltage" type="number" min="0" step="any" placeholder="Enter voltage">
            </div>

            <p class="field-hint">Enter the two known values. Leave the value you want to calculate empty.</p>
            <button class="calculate-button" type="submit">Calculate</button>
            <div id="ohms-result" aria-live="polite"></div>
        </form>
    `;
}

export function calculateOhms(formData) {
    const target = formData.get("target");
    const current = readNumber(formData, "current");
    const resistance = readNumber(formData, "resistance");
    const voltage = readNumber(formData, "voltage");

    const values = { current, resistance, voltage };
    const knownValues = Object.entries(values).filter(([key, value]) =>
        key !== target && value !== null
    );

    if (knownValues.length !== 2) {
        throw new Error("Enter exactly two known values and leave the target value empty.");
    }

    if (Object.values(values).some(value => value !== null && value < 0)) {
        throw new Error("Values cannot be negative.");
    }

    let result;
    let formula;
    let steps;

    if (target === "voltage") {
        if (current === 0 || resistance === 0) {
            result = 0;
        } else {
            result = current * resistance;
        }

        formula = "V = I × R";
        steps = `V = ${current} × ${resistance}`;
    } else if (target === "current") {
        if (resistance === 0) {
            throw new Error("Resistance must be greater than zero to calculate current.");
        }

        result = voltage / resistance;
        formula = "I = V / R";
        steps = `I = ${voltage} / ${resistance}`;
    } else {
        if (current === 0) {
            throw new Error("Current must be greater than zero to calculate resistance.");
        }

        result = voltage / current;
        formula = "R = V / I";
        steps = `R = ${voltage} / ${current}`;
    }

    const units = {
        voltage: "V",
        current: "A",
        resistance: "Ω"
    };

    return {
        title: "Ohm's Law",
        value: `${formatNumber(result)} ${units[target]}`,
        formula,
        steps: [
            `Use the formula: ${formula}`,
            steps,
            `Result: ${formatNumber(result)} ${units[target]}`
        ]
    };
}

function readNumber(formData, name) {
    const rawValue = formData.get(name);

    if (rawValue === null || rawValue.trim() === "") {
        return null;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
        throw new Error("Enter valid numeric values.");
    }

    return value;
}

function formatNumber(value) {
    return Number(value.toPrecision(8)).toString();
}
