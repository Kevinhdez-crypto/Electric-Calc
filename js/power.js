
export function getPowerForm() {
    return `
        <form class="calculator-form" id="power-form">
            <div class="form-field">
                <label for="power-target">Calculate</label>
                <select id="power-target" name="target">
                    <option value="power">Power (W)</option>
                    <option value="voltage">Voltage (V)</option>
                    <option value="current">Current (A)</option>
                    <option value="resistance">Resistance (Ω)</option>
                </select>
            </div>

            <div class="form-field">
                <label for="power-voltage">Voltage (V)</label>
                <input id="power-voltage" name="voltage" type="number" min="0" step="any" placeholder="Enter voltage">
            </div>

            <div class="form-field">
                <label for="power-current">Current (A)</label>
                <input id="power-current" name="current" type="number" min="0" step="any" placeholder="Enter current">
            </div>

            <div class="form-field">
                <label for="power-resistance">Resistance (Ω)</label>
                <input id="power-resistance" name="resistance" type="number" min="0" step="any" placeholder="Enter resistance">
            </div>

            <div class="form-field">
                <label for="power-power">Power (W)</label>
                <input id="power-power" name="power" type="number" min="0" step="any" placeholder="Enter power">
            </div>

            <p class="field-hint">Enter two known values and leave the target value empty.</p>
            <button class="calculate-button" type="submit">Calculate</button>
            <div id="power-result" aria-live="polite"></div>
        </form>
    `;
}

export function calculatePower(formData) {
    const target = formData.get("target");
    const voltage = readNumber(formData, "voltage");
    const current = readNumber(formData, "current");
    const resistance = readNumber(formData, "resistance");
    const power = readNumber(formData, "power");

    const values = { voltage, current, resistance, power };
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
    let calculation;

    if (target === "power") {
        if (voltage !== null && current !== null) {
            result = voltage * current;
            formula = "P = V × I";
            calculation = `P = ${voltage} × ${current}`;
        } else if (current !== null && resistance !== null) {
            result = current ** 2 * resistance;
            formula = "P = I² × R";
            calculation = `P = ${current}² × ${resistance}`;
        } else if (voltage !== null && resistance !== null) {
            if (resistance === 0) {
                throw new Error("Resistance must be greater than zero.");
            }

            result = voltage ** 2 / resistance;
            formula = "P = V² / R";
            calculation = `P = ${voltage}² / ${resistance}`;
        } else {
            throw new Error("Use voltage and current, current and resistance, or voltage and resistance.");
        }
    } else if (target === "voltage") {
        if (current !== null && resistance !== null) {
            result = current * resistance;
            formula = "V = I × R";
            calculation = `V = ${current} × ${resistance}`;
        } else if (power !== null && current !== null) {
            if (current === 0) {
                throw new Error("Current must be greater than zero.");
            }

            result = power / current;
            formula = "V = P / I";
            calculation = `V = ${power} / ${current}`;
        } else if (power !== null && resistance !== null) {
            result = Math.sqrt(power * resistance);
            formula = "V = √(P × R)";
            calculation = `V = √(${power} × ${resistance})`;
        } else {
            throw new Error("Enter current and resistance, power and current, or power and resistance.");
        }
    } else if (target === "current") {
        if (voltage !== null && resistance !== null) {
            if (resistance === 0) {
                throw new Error("Resistance must be greater than zero.");
            }

            result = voltage / resistance;
            formula = "I = V / R";
            calculation = `I = ${voltage} / ${resistance}`;
        } else if (power !== null && voltage !== null) {
            if (voltage === 0) {
                throw new Error("Voltage must be greater than zero.");
            }

            result = power / voltage;
            formula = "I = P / V";
            calculation = `I = ${power} / ${voltage}`;
        } else if (power !== null && resistance !== null) {
            if (resistance === 0) {
                throw new Error("Resistance must be greater than zero.");
            }

            result = Math.sqrt(power / resistance);
            formula = "I = √(P / R)";
            calculation = `I = √(${power} / ${resistance})`;
        } else {
            throw new Error("Enter voltage and resistance, power and voltage, or power and resistance.");
        }
    } else {
        if (voltage !== null && current !== null) {
            if (current === 0) {
                throw new Error("Current must be greater than zero.");
            }

            result = voltage / current;
            formula = "R = V / I";
            calculation = `R = ${voltage} / ${current}`;
        } else if (voltage !== null && power !== null) {
            if (power === 0) {
                throw new Error("Power must be greater than zero.");
            }

            result = voltage ** 2 / power;
            formula = "R = V² / P";
            calculation = `R = ${voltage}² / ${power}`;
        } else if (current !== null && power !== null) {
            if (current === 0) {
                throw new Error("Current must be greater than zero.");
            }

            result = power / current ** 2;
            formula = "R = P / I²";
            calculation = `R = ${power} / ${current}²`;
        } else {
            throw new Error("Enter voltage and current, voltage and power, or current and power.");
        }
    }

    const units = {
        power: "W",
        voltage: "V",
        current: "A",
        resistance: "Ω"
    };

    return {
        title: "Electrical Power",
        value: `${formatNumber(result)} ${units[target]}`,
        formula,
        steps: [
            `Use the formula: ${formula}`,
            calculation,
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
