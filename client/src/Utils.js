
const isLogged = () => {
    const item = sessionStorage.getItem('utilisateur');
    return (item !== undefined && item !== null && item !== '');
};

const getUserName = () => {return sessionStorage.getItem('utilisateur')};

const authService = {isLogged:isLogged, getUserName:getUserName}
export default authService;