import {Component} from "react";
import Cookies from "js-cookie";
import CreateTodo from "../CreateTodo";
import TodoItem from "../TodoItem";
import Profile from "../Profile";
import "./index.css";

const filters=["","done","in progress","pending","completed"];

class Dashboard extends Component{
    state={todoList:[], filter:filters[0] , taskDone:0, name:"", createTodo:false};

    deleteATask=async(id)=>{
        const api=`http://localhost:5000/task/${id}/delete`;
        const token=Cookies.get('jwt_token');
        console.log("token is", token);
        const options={
            method:"DELETE",
            headers:{
                'Authorization':`Bearer ${token}`
            }
        };
        const response=await fetch(api, options);
        const data=await response.json();
        console.log("deleted a todo", data);
        this.fetchList();
    }

    updateName=(name)=>{
        this.setState({name});
    }

    updateTaskDone=(n)=>{
        this.setState({taskDone:n});
    }

    logout=()=>{
        Cookies.remove('jwt_token');
        const {navigate}=this.props;
        console.log("logout clicked");
        navigate('/login',{replace:true});
    }

    fetchList= async ()=>{
        const token=Cookies.get('jwt_token');
        const api="http://localhost:5000/";
        const options={
            method:"GET",
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }
        const response=await fetch(api, options);
        const data=await response.json();
        if(response.ok){
            const n=data.filter(ele=>"done completed".includes(ele.status.toLowerCase())).length;
            this.setState({todoList:data, taskDone:n});
            console.log(data);
        }
        else{
            console.log("todo list api failed");
        }
    }

    createTodoFun=async(obj)=>{
        const token=Cookies.get("jwt_token");
        const api="http://localhost:5000/task/add";
        const options={
            method:"POST",
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({...obj})
        };
        const response = await fetch(api, options);
        const data = await response.json();
        if (response.ok){
            console.log("todo added");
            this.fetchList();
        }
        else{
            console.log("error occured");
        }
        this.setState({createTodo:false})
    }

    getGreeting=(d)=> {
        const now = d; // Get current date and time
        const hours = now.getHours(); // Get the current hour (0-23)
      
        let greeting = "";
      
        if (hours >= 6 && hours < 12) {
          greeting = "Good Morning";
        } else if (hours >= 12 && hours < 16) {
          greeting = "Good Afternoon";
        } else if (hours >= 16 && hours < 20) {
          greeting = "Good Evening";
        } else {
          greeting = "Good Night";
        }
      
        return greeting;
      }

    componentDidMount=()=>{
        this.fetchList()
    }

    render() {
        console.log("dashboard route");
        const {todoList, filter, taskDone, name, createTodo}=this.state;
        const todos=todoList.length;
        let percent=Math.round((taskDone/todos)*100).toString()+"% Done";
        if(todos===0){
            percent=0;
        }
        const taskList=todoList.filter(ele=>ele.status.toLowerCase().includes(filter.toLowerCase()));
        const today=new Date();
        const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const dateTag= today.toLocaleDateString('en-US', options);
        console.log(dateTag);

        return(
            <div className="home-container">
                {createTodo && <div className="modal" style={{opacity:createTodo?"1":"0.2"}}>
                    <button className="close-button" onClick={()=>{this.setState({createTodo:false})}}>Close</button>
                    <CreateTodo create={this.createTodoFun}/>
                </div>}
                <div className="main-container" style={{pointerEvents:createTodo?"none":"all", opacity:createTodo?"0.2":"1"}}>
                    <div className="profile-container">
                        <Profile updateName={this.updateName}/>
                        <button className="logout-btn" onClick={this.logout}>Logout</button>
                    </div>
                    <h1 className="greeting-user">{this.getGreeting(today)} {name}</h1>
                    <div className="day-container">
                        <p className="para-day">Today's {days[today.getDay()]}<br/><span className="light-text">{dateTag}</span></p>
                        <p className="para-day" style={{textAlign:"right"}}>{percent}<br/><span className="light-text">Completed tasks</span></p>
                    </div>
                    <ul className="filter-container">
                        <li onClick={()=>{this.setState({filter:filters[0]})}} className={filter===""?"active-filters":"filters"}>All</li>
                        <li onClick={()=>{this.setState({filter:filters[1]})}} className={filter==="done"?"active-filters":"filters"}>Done</li>
                        <li onClick={()=>{this.setState({filter:filters[2]})}} className={filter==="in progress"?"active-filters":"filters"}>Pending</li>
                        <li onClick={()=>{this.setState({filter:filters[3]})}} className={filter==="pending"?"active-filters":"filters"}>In Progress</li>
                        <li onClick={()=>{this.setState({filter:filters[4]})}} className={filter==="completed"?"active-filters":"filters"}>Completed</li>
                    </ul>
                    {taskList.length>0 && <ul className="todo-list">
                        {
                            taskList.map(ele=> <TodoItem key={ele.id} deletes={this.deleteATask} reloadList={this.fetchList} item={ele} />)
                        }
                    </ul>}
                    {
                        taskList.length===0 && <div className="indication">there are no todo's.</div>
                    }
                    <button className="add-task" onClick={()=>{this.setState({createTodo:true})}}>+</button>
                </div>
            </div>
        )
    }
}

export default Dashboard