export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export const openDrawer = () => {
    return {
        type: OPEN_DRAWER
    }
};

export const closeDrawer = () => {
    return {
        type: CLOSE_DRAWER
    }
};