
export const mergeAndSum = async (tables: any[]): Promise<any> => {
    const merged: Record<string, number[]> = {};
    let header: any[] | null = null;
    const labelOrder: string[] = [];

    for (const table of tables) {

        const rows = Array.isArray(table) ? table : (table as any)?.labels;

        if (!Array.isArray(rows) || rows.length === 0) continue;


        if (!header) {
            header = rows[0];
        }


        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!Array.isArray(row) || row.length === 0) continue;

            const label = String(row[0]);

            const values = row.slice(1).map(v => Number(v) || 0);

            if (!merged[label]) {
                merged[label] = values;
                labelOrder.push(label);
            } else {

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


    return [
        header,
        ...labelOrder.map(label => [label, ...merged[label]])
    ];
};

