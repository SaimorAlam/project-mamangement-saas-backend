
export const mergeAndSum = async (tables: any[]): Promise<any> => {
    const merged: Record<string, number[]> = {};
    let header: any[] | null = null;
    const labelOrder: string[] = [];

    for (const table of tables) {
        // Handle both raw arrays and objects with .labels
        const rows = Array.isArray(table) ? table : (table as any)?.labels;

        if (!Array.isArray(rows) || rows.length === 0) continue;

        // Use the first row as the header from the first available table
        if (!header) {
            header = rows[0];
        }

        // Process data rows starting from the second row (skipping header at index 0)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!Array.isArray(row) || row.length === 0) continue;

            const label = String(row[0]);
            // Extract values (rest of the row), converting to numbers
            const values = row.slice(1).map(v => Number(v) || 0);

            if (!merged[label]) {
                merged[label] = values;
                labelOrder.push(label);
            } else {
                // Sum values element-wise, handling varying row lengths
                const currentValues = merged[label];
                const maxLength = Math.max(currentValues.length, values.length);
                const updatedValues: number[] = [];

                for (let j = 0; j < maxLength; j++) {
                    const v1 = currentValues[j] || 0;
                    const v2 = values[j] || 0;
                    updatedValues.push(v1 + v2);
                }
                merged[label] = updatedValues;
            }
        }
    }

    if (!header) return [];

    // Return the result in original array format: [header, [label, val1...], ...]
    return [
        header,
        ...labelOrder.map(label => [label, ...merged[label]])
    ];
};

