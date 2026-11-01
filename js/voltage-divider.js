export function getVoltageDividerForm() {
    return `
        <form class="calculator-form" id="voltage-divider-form">
            <div class="form-field">
                <label for="divider-input">Input voltage (V)</label>
                <input id="divider-input" name="inputVoltage" type="number" min="0" step="any" placeholder="Enter input voltage" required>
            </div>

            <div class="form-field">
                <label>Resistors in series (from Vin to Ground)</label>
                <div data-resistor-list>
                    <div class="form-field resistor-row">
                        <label>R1 (Ω)</label>
                        <input name="resistances" type="number" min="0" step="any" placeholder="Enter R1" required>
                        <button class="calculate-button" type="button" data-action="remove-resistor">Remove</button>
                    </div>
                    <div class="form-field resistor-row">
                        <label>R2 (Ω)</label>
                        <input name="resistances" type="number" min="0" step="any" placeholder="Enter R2" required>
                        <button class="calculate-button" type="button" data-action="remove-resistor">Remove</button>
                    </div>
                </div>
                <button class="calculate-button" type="button" data-action="add-resistor">Add resistor</button>
            </div>

            <div class="form-field">
                <label for="divider-resistor">Voltage across</label>
                <select id="divider-resistor" name="targetResistor" required>
                    <option value="1">R1</option>
                    <option value="2" selected>R2</option>
                </select>
            </div>

            <button class="calculate-button" type="submit">Calculate</button>
            <div id="divider-result" aria-live="polite"></div>
        </form>
    `;
}

export function calculateVoltageDivider(formData) {
    const inputVoltage = readNumber(formData, "inputVoltage");
    const resistances = formData.getAll("resistances").map(value => {
        if (value.trim() === "") {
            return null;
        }

        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    });
    const targetIndex = Number(formData.get("targetResistor"));

    if (inputVoltage === null) {
        throw new Error("Enter a valid input voltage.");
    }

    if (inputVoltage < 0) {
        throw new Error("Input voltage cannot be negative.");
    }

    if (resistances.length < 2 || resistances.some(value => value === null)) {
        throw new Error("Enter at least two valid resistances.");
    }

    if (resistances.some(value => value <= 0)) {
        throw new Error("All resistances must be greater than zero.");
    }

    if (!Number.isInteger(targetIndex) || targetIndex < 1 || targetIndex > resistances.length) {
        throw new Error("Select a valid resistor.");
    }

    const totalResistance = resistances.reduce((sum, value) => sum + value, 0);
    const targetLabel = `R${targetIndex}`;
    const targetResistance = resistances[targetIndex - 1];

    const seriesCurrent = inputVoltage / totalResistance;
    const outputVoltage = inputVoltage * targetResistance / totalResistance;
    const voltageDrops = resistances.map(resistance => inputVoltage * resistance / totalResistance);
    const formula = "Vk = Vin × Rk / Rtotal";

    return {
        title: "Voltage Divider",
        value: `Voltage across ${targetLabel}: ${formatNumber(outputVoltage)} V`,
        formula,
        steps: [
            `Total resistance = ${resistances.map(formatNumber).join(" + ")} = ${formatNumber(totalResistance)} Ω`,
            `Series current = Vin / Rtotal = ${formatNumber(inputVoltage)} / ${formatNumber(totalResistance)} = ${formatNumber(seriesCurrent)} A`,
            `V${targetIndex} = Vin × ${targetLabel} / Rtotal = ${formatNumber(inputVoltage)} × ${formatNumber(targetResistance)} / ${formatNumber(totalResistance)} = ${formatNumber(outputVoltage)} V`,
            `Voltage across each resistor: ${voltageDrops.map((drop, index) => `R${index + 1} = ${formatNumber(drop)} V`).join(", ")}`,
            `Check: sum of all voltage drops = ${formatNumber(voltageDrops.reduce((sum, drop) => sum + drop, 0))} V`
        ]
    };
}

function readNumber(formData, name) {
    const rawValue = formData.get(name);

    if (rawValue === null || rawValue.trim() === "") {
        return null;
    }

    const value = Number(rawValue);
    return Number.isFinite(value) ? value : null;
}

function formatNumber(value) {
    return Number(value.toPrecision(8)).toString();
}