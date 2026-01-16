/**
 * Polygon Data for Konstanz Zip Codes
 * Covers land areas of Konstanz - carefully avoiding Bodensee (lake)
 *
 * Geography Notes:
 * - Konstanz sits on a peninsula between Untersee (west) and Obersee (east)
 * - The lake shore is roughly at latitude 47.66-47.67 in the city center
 * - North of 47.68 is safely on land
 * - West around longitude 9.10-9.14 is inland (Wollmatingen area)
 */
export const ZIP_POLYGONS = {
    // 78459 - Wollmatingen, Dettingen (Northwest - safely inland)
    '78459': [
        [47.74, 9.08],
        [47.75, 9.10],
        [47.75, 9.13],
        [47.74, 9.15],
        [47.72, 9.15],
        [47.71, 9.13],
        [47.71, 9.10],
        [47.72, 9.08]
    ],
    // 78461 - Fürstenberg, Paradies (West side - inland)
    '78461': [
        [47.71, 9.10],
        [47.72, 9.10],
        [47.72, 9.14],
        [47.71, 9.16],
        [47.70, 9.16],
        [47.69, 9.14],
        [47.69, 9.11],
        [47.70, 9.10]
    ],
    // 78462 - Altstadt (City Center - only the northern land part)
    '78462': [
        [47.70, 9.14],
        [47.71, 9.15],
        [47.71, 9.17],
        [47.70, 9.18],
        [47.69, 9.18],
        [47.68, 9.17],
        [47.68, 9.15],
        [47.69, 9.14]
    ],
    // 78464 - Staad, Egg (East - northern area, away from lake)
    '78464': [
        [47.72, 9.17],
        [47.73, 9.18],
        [47.73, 9.21],
        [47.72, 9.22],
        [47.71, 9.22],
        [47.70, 9.20],
        [47.70, 9.18],
        [47.71, 9.17]
    ],
    // 78465 - Litzelstetten, Dingelsdorf (North - Bodanrück peninsula, land areas)
    '78465': [
        [47.75, 9.14],
        [47.77, 9.15],
        [47.78, 9.17],
        [47.77, 9.19],
        [47.75, 9.19],
        [47.74, 9.17],
        [47.74, 9.15]
    ],
    // 78467 - Petershausen, Industriegebiet (Northeast - industrial area)
    '78467': [
        [47.71, 9.15],
        [47.72, 9.17],
        [47.72, 9.19],
        [47.71, 9.20],
        [47.70, 9.20],
        [47.69, 9.19],
        [47.69, 9.17],
        [47.70, 9.16]
    ]
};

// Center coordinates for each PLZ (for markers/labels)
export const ZIP_CENTERS = {
    '78459': [47.73, 9.11],
    '78461': [47.705, 9.13],
    '78462': [47.695, 9.16],
    '78464': [47.715, 9.195],
    '78465': [47.76, 9.17],
    '78467': [47.705, 9.18]
};
