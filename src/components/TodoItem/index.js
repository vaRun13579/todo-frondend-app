import {useState, useEffect} from "react";
import Cookies from "js-cookie";
import "./index.css";

export default (props)=>{
    const {item, deletes, reloadList}=props;
    const {id, title, description, updated_at, created_at, user_id, status}=item;
    const [edit, setEdit]=useState(false);
    const [eTitle, setTitle]=useState(title);
    const [eDescription, setDesc]=useState(description);
    const [eStatus, setStatus]=useState(status);
    const token=Cookies.get('jwt_token');


    const colors=["#EDDFE0","#73EC8B","#6A9AB0","#C96868","#FCDE70","#EAE4DD","#EECAD5"];

    function getRandomColor(){
        const l=colors.length;
        return colors[Math.floor(Math.random()*1000)%l];  
    }



    const saveEdit=()=>{
        async function call(){
            const api=`http://localhost:5000/task/${id}/edit`;
            const options={
                method:"PUT",
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'title': `${eTitle}`,
                    'description':`${eDescription}`,
                    'status':`${eStatus}`
                })
            };

            const response=await fetch(api, options);
            const data=await response.json();
            if (response.ok){reloadList();console.log("update todo item,", data);}
            else{
                console.log(data);
            }
        }
        call();
    };

    // console.log(getRandomColor());

    return ( 
        <li className="list-item" style={{backgroundColor:`${getRandomColor()}`}}>
            <div className="item-wrapper">
                {!edit && <h1 className='item-heading'>{eTitle}</h1>}
                {edit && <input className="input-todo-item item-heading" value={eTitle} onChange={(ev)=>{setTitle(ev.target.value)}} type="text"/>}
                <hr className="line"/>
                {!edit && <p className="item-desc">{eDescription}</p>}
                {edit && <textarea rows="4" className="text-area-todo-item item-desc" onChange={(ev)=>{setDesc(ev.target.value)}} value={eDescription}/>}
            </div>
            <div className="functional-buttons">
                {edit && <button onClick={()=>{saveEdit();setEdit(ps=>!ps); }} className="edit-item">Save</button>}
                {!edit && <button onClick={()=>{setEdit(ps=>!ps)}} className="edit-item">Edit</button>}
                {!edit && <button className="delete-item-button" onClick={()=>{deletes(id)}}>Delete</button>}
                {!edit && <div className="status">{eStatus}</div>}
                {edit && <select value={eStatus} onChange={(ev)=>{setStatus(ev.target.value)}} className="status">
                    <option value="in progress">in progress</option>
                    <option value="done">done</option>
                    <option value="pending">pending</option>
                    <option value="completed">completed</option>
                </select>}
            </div>
        </li>
    )
}