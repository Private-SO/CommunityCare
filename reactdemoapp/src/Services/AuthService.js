/**
 * @author Mayank Bagla
 */

//AutheService is used for autheticating users, registering users and maintaining user sessions.

export default {
    login : user =>{
        return fetch('/user/login',{
            method:"post",
            body:JSON.stringify(user),
            headers :{
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { isAuthenticated: false,message:{msgBody : "Incorrect Username/Password. Try again or click Forgot password to reset it.", msgError: true}, user: {username: "", role: ""}};
        })
    },
    register : user =>{
        return fetch('/user/register',{
            method:"post",
            body:JSON.stringify(user),
            headers :{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
          .then(data => data);
    },
    forget : user =>{
        return fetch('/user/forgot',{
            method:"put",
            body:JSON.stringify(user),
            headers :{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
          .then(data => data);
    },
    mailing : user =>{
        return fetch('/user/mailing',{
            method:"post",
            body:JSON.stringify(user),
            headers :{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
          .then(data => data);
    },
    reset : user =>{
        return fetch('/user/reset',{
            method:"put",
            body:JSON.stringify(user),
            headers :{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
          .then(data => data);
    },
    logout : ()=>{
        return fetch('/user/logout')
                .then (res=>res.json())
                .then (data => data);
    },
    isAuthenticated : ()=>{
        return fetch('/user/authenticated')
                .then(res=>{
                    if(res.status !== 401)
                        return res.json().then(data => data);
                    else
                        return { isAuthenticated: false, user: {username: "", role: ""}};
                });
    }
}