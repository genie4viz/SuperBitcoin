
export const animateButton = (menu) => {
    const element = document.getElementById(menu);
    element.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(1)' }
    ], {
        duration: 200,
        iterations: 1
    });
};
