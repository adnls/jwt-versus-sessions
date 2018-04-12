import axios from 'axios';

export default
class AuthService {

    login(cb){
        axios.post('/api/login', {
            username:'admin', 
            password:'password'
        })
        .then( res => {
           console.log(res);
           localStorage.setItem('jwtKey', res.data.jwtKey);
           console.log(this.getJwtKey());
           cb();
        })
        .catch( err => {
           console.log(err);
        });
    }

    getJwtKey(){
        return localStorage.getItem('jwtKey');
    }

    getAxiosCredentials(){
        const credentials = localStorage.getItem('jwtKey') || '';
        return {
            headers:{"x-xsrf-token":credentials}, 
            withCredentials:true,
            validateStatus: function (status) {
                return status < 500; // Reject only if the status code is greater than or equal to 500
              }
        };
    }
}