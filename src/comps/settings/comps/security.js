import { useState,useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {APIIP} from '../config';
const Security = () => {

    const notify = (msg,Type) => {
        toast(msg,{
            type: Type,
            theme: 'dark'
        })
    }
    
    const [password,setPassword] = useState("");
    const [newPassword1,setNewPassword1] = useState("");
    const [newPassword2,setNewPassword2] = useState("");

    function loginInfo(loginData){        
            var obj ={};                             
            loginData = loginData.split("+");
            obj.ip = loginData[0];
            obj.place = loginData[1];
            obj.time = loginData[2];
            obj.device =loginData[3];                  
            return obj;  
    }



    const [currInfo,setCurrInfo] = useState("");
    const [prevInfo,setPrevInfo] = useState("");
    const [oldInfo,setOldInfo] = useState("");
    const [layoutRendered,setLayoutRendered] = useState(false);

    const changePassword = () => {
        
        if(newPassword1 === newPassword2) {
            let obj = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionkey"),
                oldPassword: password,
                password: newPassword1
            }
            
            fetch(APIIP.ip+'/updatepass', {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then( (response) => {                
                if(response.ok) {
                    notify("Changed Password","success");
                    setPassword("");
                    setNewPassword1("");
                    setNewPassword2("");
                }else if(response.status===400){
                    setPassword("");
                    setNewPassword1("");
                    setNewPassword2("");
                    notify("Old Password Wrong","error");                    
                }
            })             
            .catch(err => console.log(err));
        }else{
            notify("New passwords doesn't match", "warning"); 
            setPassword("");  
            setNewPassword1("");
            setNewPassword2("");
        }
    }

    useEffect(() =>{

        fetch(APIIP.ip+'/logindata/'+localStorage.getItem("userId"),{})
        .then( (response) =>{
            return response.json();
        })
        .then( (response) => {              
            setCurrInfo(loginInfo(response.currentLogin));
            setPrevInfo(loginInfo(response.previousLogin));
            setOldInfo(loginInfo(response.oldLogin));  
            setLayoutRendered(true);          
        });


    },[])
        
    return ( 
        <>
            <>
                <div className="title">Security and Privacy</div>

                <div className="sub-container-sec">
                    <div className="sub-title">Previous logins of your account</div>
                    <div className="all-login-container">
                        <div className="login-info">
                            <span className="location-symbol">
                                                            
                            </span>
                            <div className="login-info-grid">
                                <span className="login-place-time">                                    
                                    <span className="login-place"><i className="fa fa-location-arrow" aria-hidden="true"></i>{layoutRendered && currInfo.place}</span>
                                    <span className="login-time-device">Active - Now  {layoutRendered && currInfo.device }</span>
                                </span>
                                <span className="login-place-time">
                                    <span className="login-place"><i className="fa fa-location-arrow" aria-hidden="true"></i>{layoutRendered && prevInfo.place}</span>
                                    <span className="login-time-device">{layoutRendered && prevInfo.time} · {layoutRendered && prevInfo.device}</span>
                                </span>
                                <span className="login-place-time">
                                    <span className="login-place"><i className="fa fa-location-arrow" aria-hidden="true"></i>{layoutRendered && oldInfo.place}</span>
                                    <span className="login-time-device">{layoutRendered && oldInfo.time} ·{layoutRendered && oldInfo.device}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <br />
                <div className="sub-container-sec">
                    <div className="sub-title">Change Password</div>

                    <form className="change-password-form">
                        <span className="change-pass-row">
                            <label>Old Password :</label>
                            <input placeholder="Enter old password" type="password" value={password} onChange={ (e) => { setPassword(e.target.value); }}/>
                        </span>
                        <span className="change-pass-row">
                            <label>New Password :</label>
                            <input placeholder="Enter new password" type="password" value={newPassword1} onChange={ (e) => { setNewPassword1(e.target.value); }} />
                        </span>
                        <span className="change-pass-row">
                            <label>Retype New Password :</label>
                            <input placeholder="Enter new password again" type="password" value={newPassword2} onChange={ (e) => { setNewPassword2(e.target.value); }} />
                        </span>                                   
                        <Button onClick={ (e) => { e.preventDefault(); changePassword(); }} variant="danger">Change Password</Button>
                    </form>
                </div>
            </>
        </>
     );
}
 
export default Security;
