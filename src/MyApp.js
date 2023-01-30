import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Table from './Table';
import Form from './Form';


function MyApp() {
  const [characters, setCharacters] = useState([]);

  async function makeDeleteCall(ID) {
    try {    
      const response = await axios.delete(`http://localhost:5000/users/${ID}`);
      return response;     
    }
    catch (error){
      //We're not handling errors. Just logging into the console.
      console.log(error); 
      return false;         
    } 
  }

  function removeOneCharacter (index) {
    const id = characters[index].id;
    makeDeleteCall(id).then( result => {
      if (result && result.status === 204) {
        const updated = characters.filter((characters, i) => {
          return i !== index
        })
        setCharacters(updated);
      }
    });
  }

  async function fetchAll(){
    try {
      const response = await axios.get('http://localhost:5000/users');
      return response.data.users_list;     
    }
    catch (error){
      //We're not handling errors. Just logging into the console.
      console.log(error); 
      return false;         
    }
  }

  useEffect(() => {
    fetchAll().then( result => {
      if (result)
        setCharacters(result);
    });
  }, [] );

  async function makePostCall(person){
    try {
      const response = await axios.post('http://localhost:5000/users', person);
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  function updateList(person) { 
    makePostCall(person).then( result => {
      if (result && result.status === 201) {
        person.id = result.data;
        setCharacters([...characters, person]);
      }
    });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList}/>
    </div> 
  )
}

export default MyApp;