import {useEffect, useState} from "react"

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos,setTodos] = useState([]);
    const [error,seterror] = useState([]);
    const [message,setmessage] = useState([])
    const [editId, setEditId] = useState(-1);

    // Edit
    const [edittitle, setEdittitle] = useState("");
    const [editdescription, setEditdescription] = useState("");

    const apiUrl = "http://localhost:8000"

    const handleSubmit =() => {
        seterror("")
        //   check inputs
        if(title.trim() !== '' && description.trim() !== ''){
            fetch(apiUrl+"/todos",{
                method:"post",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res)=> {
                if(res.ok){
                    // add item to list
                    setTodos([...todos,{title,description}])
                    setmessage("Item added successfully")
                    setTimeout(() =>{
                        setmessage("");
                    },3000)
                }else{
                    // set error
                    seterror("unable to create Todo item") 
                }
            
        }).catch(() =>{

        })
            
           
        }
    }

    useEffect(() =>{
        getItems()
    },[])

    const getItems = () =>{
        fetch(apiUrl+"/todos")
        .then((res) => res.json())
        .then ((res) =>{
            setTodos(res)
        })
    }

    const handleEdit = (item) =>{
        setEditId(item._id);
        setEdittitle(item.title);
        setEditdescription(item.description)
    }


    const handleUpdate = () =>{
     seterror("")
        //check inputs
        if (edittitle.trim() !== '' && editdescription.trim() !== '') {
            fetch(apiUrl+"/todos/"+editId, {
                method: "PUT",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title: edittitle, description: editdescription})
            }).then((res) => {
                if (res.ok) {
                    //update item to list
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = edittitle;
                            item.description = editdescription;
                        }
                        return item;
                    })

                    setTodos(updatedTodos)
                    setEdittitle("");
                    setEditdescription("");
                    setmessage("Item updated successfully")
                    setTimeout(() => {
                        setmessage("");
                    },3000)
                    setEditId(-1)
    
                }else {
                    //set error
                    seterror("Unable to create Todo item")
                }
            }).catch(() => {
                seterror("Unable to create Todo item")
            })
        }
    }
           
    const handleEditCancel = () => {
        setEditId(-1)
    }

    const handleDelete = () => {
        if(window.confirm('Are you sure want to delete ?')){
            fetch(apiUrl+'/todos/'+ editId,{
                method : "DELETE"
            })
            .then(() => {
                const updatedTodos = todos.filter((item) => item._id !== editId)
                setTodos(updatedTodos)
            })
        }

    }


 

    return <>
    <div className="row p-3 bg-success text-light"> 
        <h1>ToDo Project with MERN Stack</h1>
    </div>
    <div className="row">
         <h3>Add Item</h3>
         {message && <p className="text-success">{message}</p>}
         <div className="from-group d-flex gap-2">
              <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type ="text"/>
              <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type ="text"/>
              <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
          </div>
          {error &&<p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
            {
                todos.map((item) =>
                    <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column me-2">
                    {
                        editId == -1 || editId !== item._id ? <>
                            <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>
                        </> : <>
                        <div className="from-group d-flex gap-2">
                            <input placeholder="Title" onChange={(e) => setEdittitle(e.target.value)} value={edittitle} className="form-control" type ="text"/>
                            <input placeholder="Description" onChange={(e) => setEditdescription(e.target.value)} value={editdescription} className="form-control" type ="text"/> 
                        </div>
                        </>
                  }

                </div>
                        <div className="d-flex gap-2">
                        { editId == -1 ? <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>:<button onClick={handleUpdate}>update</button>}
                        { editId == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>:
                        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
                        </div>
                   </li>
                )
            }
            
         </ul>  
                          
    </div>
    </>

}
