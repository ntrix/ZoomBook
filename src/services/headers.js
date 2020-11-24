// eslint-disable-next-line
export default function() {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-type': 'application/json',
        Authorization: (user && user.token? `Bearer ${user.token}`: {}),
    };
}
