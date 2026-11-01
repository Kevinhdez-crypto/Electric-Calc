
export function getCurrentDividerForm() {
    return `
        <form class="calculator-form" id="current-divider-form">
            <div class="form-field">
                <label for="current-divider-input">Total input current (A)</label>
                <input id="current-divider-input" name="totalCurrent" type="number" min="0" step="any" placeholder="Enter total current" required>
            </div>

            <div class="form-field">
                <label>Resistors in parallel (Ω)</label>
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

            <button class="calculate-button" type="submit">Calculate</button>
            <div id="current-divider-result" aria-live="polite"></div>
        </form>
    `;
}

export function calculateCurrentDivider(formData) {
    const rawCurrent = formData.get("totalCurrent");
    const totalCurrent = rawCurrent === null || rawCurrent.trim() === ""
        ? null
        : Number(rawCurrent);

    const resistances = formData.getAll("resistances").map(value => {
        if (value.trim() === "") {
            return null;
        }

        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    });

    if (totalCurrent === null || !Number.isFinite(totalCurrent)) {
        throw new Error("Enter a valid total current.");
    }

    if (totalCurrent < 0) {
        throw new Error("Total current cannot be negative.");
    }

    if (resistances.length < 2 || resistances.some(value => value === null)) {
        throw new Error("Enter at least two valid resistances.");
    }

    if (resistances.some(value => value <= 0)) {
        throw new Error("All resistances must be greater than zero.");
    }

    const conductanceSum = resistances.reduce(
        (sum, resistance) => sum + 1 / resistance,
        0
    );

    const equivalentResistance = 1 / conductanceSum;

    const branchCurrents = resistances.map((resistance, index) => {
        const current = totalCurrent * (1 / resistance) / conductanceSum;
        return {
            label: `R${index + 1}`,
            resistance,
            current
        };
    });

    const formula = "Ik = Itotal × (1 / Rk) / Σ(1 / R)";

    return {
        title: "Current Divider",
        value: `Equivalent resistance: ${formatNumber(equivalentResistance)} Ω`,
        formula,
        steps: [
            `Total input current = ${formatNumber(totalCurrent)} A`,
            `Parallel resistances: ${resistances.map(value => `${formatNumber(value)} Ω`).join(", ")}`,
            `Equivalent resistance = ${formatNumber(equivalentResistance)} Ω`,
            ...branchCurrents.map(branch =>
                `Current through ${branch.label} (${formatNumber(branch.resistance)} Ω) = ${formatNumber(branch.current)} A`
            ),
            `Check: sum of branch currents = ${formatNumber(branchCurrents.reduce((sum, branch) => sum + branch.current, 0))} A`
        ]
    };
}

function formatNumber(value) {
    return Number(value.toPrecision(8)).toString();
}
