export const randomString = () => {
    return Math.random().toString(36).substring(10);
};

export function isUserLoggedIn() {
    return false;
}