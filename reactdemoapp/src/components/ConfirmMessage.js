/**
 * Author : Ram prasath Meganathan (B00851418) - This page is used to show the success/failure message
 * Roles:   all roles
 */
import React from 'react';


const ConfirmMessage = props=>{
    return(
        <section className="alert alert-primary text-container" role="alert">
            {props.message}
        </section>
    )
}

export default ConfirmMessage
