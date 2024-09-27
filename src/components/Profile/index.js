import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css"

const Profile = (props)=>{
    const {updateName}=props;
    const token=Cookies.get('jwt_token');
    const [details, setDetails]=useState({});
    const api="http://localhost:5000/profile";
    const navigate=useNavigate();

    const options={
        method:"GET",
        headers:{
            'Authorization':`Bearer ${token}` 
        }
    }

    useEffect(()=>{
        async function call(){
            const response=await fetch(api,options);
            const data=await response.json();
            if (response.ok){
                setDetails(data);
                updateName(data.name);
            }
        }
    call()}, []);

    console.log("profile details ", details);

    return (
        <div onClick={()=>{navigate('/viewprofile')}} className="profile-pic">{details.username?.toUpperCase()[0]}</div>
    )
}

export default Profile