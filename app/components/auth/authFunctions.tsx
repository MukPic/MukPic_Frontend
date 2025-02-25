
export function addUserKey(userKey: string) {
    localStorage.setItem('userKey', userKey);
}
export function removeUserKey() {
    localStorage.removeItem('userKey');
}

export function createAuthCookie(Authorization: string) {
    const maxAge = 60 * 24 * 60 * 60; // 60일일(초 단위)
    document.cookie = `authCookie=${Authorization}; max-age=${maxAge}; path=/; secure; SameSite=Strict`;
}