export const inventoryCrumbs = ( currentRoute ) => {
    return [
        { text: 'Dashboard', link: '../dashboard' },
        { text: 'Inventory', link: '../inventory' },
        { text: currentRoute }
    ];
}