import React from 'react';
import axios from 'axios';
import "bootswatch/dist/sandstone/bootstrap.min.css";

class App extends React.Component {
  state = {
    data: null
  }

  componentDidMount() {
    axios.get('http://localhost:5000')
    .then((response) => {
      this.setState({
        data: response.data
      })
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error}`);
    })
  }
  
  render() {
    return(
      <div className = "App" >
        <h1>
          Sparck's Codex
        </h1>
        {this.state.data}
      </div>
    );
  }
}

export default App;