
export function getResistorsForm() {
    return `
        <form class="calculator-form" id="resistors-form">
            <div class="form-field">
                <label for="resistors-type">Connection type</label>
                <select id="resistors-type" name="type">
                    <option value="series">Series</option>
                    <option value="parallel">Parallel</option>
                </select>
            </div>

            <div class="form-field">
                <label for="resistors-values">Resistance values (Ω)</label>
                <input
                    id="resistors-values"
                    name="values"
                    type="text"
                    placeholder="e.g. 100, 220, 330"
                    required
                >
                <span class="field-hint">Separate each value with a comma. Use positive values only.</span>
            </div>

            <button class="calculate-button" type="submit">Calculate</button>
            <div id="resistors-result" aria-live="polite"></div>
        </form>
    `;
}

export function calculateResistors(formData) {
    const type = formData.get("type");
    const rawValues = formData.get("values");

    const resistors = rawValues
        .split(",")
        .map(value => value.trim())
        .map(Number);

    if (
        resistors.length < 2 ||
        resistors.some(value => value === 0 || !Number.isFinite(value) || value < 0)
    ) {
        throw new Error("Enter at least two positive resistance values separated by commas.");
    }

    let result;
    let formula;
    let steps;

    if (type === "series") {
        result = resistors.reduce((total, value) => total + value, 0);
        formula = "Req = R1 + R2 + ... + Rn";
        steps = `${resistors.join(" + ")} = ${formatNumber(result)} Ω`;
    } else {
        result = 1 / resistors.reduce((total, value) => total + 1 / value, 0);
        formula = "1 / Req = 1 / R1 + 1 / R2 + ... + 1 / Rn";
        steps = `1 / Req = ${resistors.map(value => `1 / ${value}`).join(" + ")}`;
    }

    return {
        title: "Equivalent Resistance",
        value: `${formatNumber(result)} Ω`,
        formula,
        steps: [
            `Connection type: ${type}`,
            `Formula: ${formula}`,
            steps,
            `Equivalent resistance: ${formatNumber(result)} Ω`
        ]
    };
}

function formatNumber(value) {
    return Number(value.toPrecision(8)).toString();
}
