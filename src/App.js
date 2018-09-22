import React, { Component } from 'react';
import logo from './unicorn-svgrepo-com.svg';
import './App.css';
import myJson from './questions.json';
import JsonTable from 'ts-react-json-table';
import {CreateQuestion, UpdateQuestion} from './graphql/mutations.js';
import Popup from 'react-popup';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { print as gqlToString } from 'graphql/language';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);



//var obj = JSON.parse(jsonobj);

var columns = [
    {key: 'Question', label: 'Question'},
    {key: 'button1', label: 'Post Question'},
    {key: 'button2', label: 'Post Answer'}
];


class Content extends React.Component {
  

  tableSettings = {
    cellRenderer: function(item, field){
      if (field === 'Question'){
        return item[field];
      } else if (field === 'button1'){
        return 'Post question';
      } else if (field === 'button2'){
        return 'Post answer';
      } else {
        return 'Error'
      }
    }
  }

  onClickCell = (event, columnName, rowData) => {
    //console.log(b)

    if(columnName === 'button1'){
      console.log('Post question', rowData);
      const question = {
        input: {
          question: rowData["Question"],
          answers: rowData["Answers"]
        }
      }
      API.graphql(graphqlOperation(gqlToString(CreateQuestion), question)).then(response => {
        rowData["id"] = response.data.createQuestion.id;
      });
    } else if (columnName === 'button2'){
      console.log('Post answer', rowData);
      if (rowData["id"] != null){
        const question = {
          input: {
            id: rowData["id"],
            answerId: rowData["Answer"]
          }
        }
        API.graphql(graphqlOperation(gqlToString(UpdateQuestion), question)).then(response => {
          console.log(response);
        });
      } else {
        console.log("Nothing");
        Popup.alert('Error: You have not submitted this question yet');
      }
    }
  }
   render() {
      return (
         <JsonTable rows={ myJson.Questions } columns={columns} settings={this.tableSettings} onClickCell={this.onClickCell} className="tabelsa"/>
      );
   }
}
class App extends Component {
  render() {
    return (
      <div className="App">
      <Popup />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Unicorn Trivia</h1>
        </header>
         <br/>
        <Content/>
      </div>
    );
  }
}


export default App;
