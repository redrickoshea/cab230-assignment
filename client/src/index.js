import React from "react";
import ReactDOM from "react-dom";
import {Header} from "./components/headerComps"
import {Hero} from "./components/heroComps"
import {RegForm, Loader} from "./components/miscComps"
import {SearchForm} from "./components/searchComps"
import {Output} from "./components/outputComps"
import {Footer} from "./components/footerComps"


import "./styles.css";

/*** Main app component ***/
class App extends React.Component 
{
  constructor(props)
  {
    super(props);
    this.state = 
    {
      loading: false,
      registration: false,
      registrationResult: "",
      loginFailed: false,
      email: "",
      password: "",
      loginToken: null,
      offences: [],
      areas: [],
      loggedIn: false,
      syncLoad: 0, // Buffer used to check whether all necessary objects have been returned before loading is set to false
      offence: "",
      area: "",
      age: "",
      year: "",
      month: "",
      gender: "",
      results: [],
      rejectedSearch: false
    }

    this.openRegistration = this.openRegistration.bind(this);
    this.closeRegistration = this.closeRegistration.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.logout = this.logout.bind(this);
    this.offenceChange = this.offenceChange.bind(this);
    this.areaChange = this.areaChange.bind(this);
    this.yearChange = this.yearChange.bind(this);
    this.monthChange = this.monthChange.bind(this);
    this.ageChange = this.ageChange.bind(this);
    this.genderChange = this.genderChange.bind(this);
    this.search = this.search.bind(this);
  }

  /*
    Open the registration from, and disable all elements of the page outside of the
    registration form
  */
  openRegistration()
  {
    document.getElementById("logFormInputs").reset(); // Clear previous inputs
    let elems = document.getElementsByClassName("interactive"); // Get all of the elements on the base page

    for (let i = 0; i < elems.length; i++)
    {
      elems[i].disabled = true; // Diable the base page elements so the registration for must be interacted with
    }

    this.setState({registration: true, email: "", password: "", loginFailed: false});
  }

  /*
    Close the registration form and re-enable all inputs of the base page
  */
  closeRegistration()
  {
    this.setState({registration: false, email: "", password: "", registrationResult: ""});
    document.getElementById("logFormInputs").reset(); // Clear previous inputs
    
    let elems = document.getElementsByClassName("interactive"); // Get all elements from the base page
    
    for (let i = 0; i < elems.length; i++)
    {
      elems[i].disabled = false; // Enable all elements of the base page so they can be used
    }
  }

  /*
    Allow email state to change when user types in email field
  */
  emailChange(address) 
  {
    this.setState({email: address});
  }

  /*
    Allow password state to change when user types in password field
  */
  passwordChange(pass) 
  {
    this.setState({password: pass});
  }

  /* 
    Allow offence state to change when the user enters an offence
  */
  offenceChange(off)
  {
    this.setState({offence: off});
  }

  /* 
    Allow area state change when the user enters areas
  */
  areaChange(loc)
  {
    this.setState({area: loc});
  }

  /* 
    Allow year state to change when user enters years
  */
  yearChange(year)
  {
    this.setState({year: year});
  }

  /* 
    Allow month state to change when user enters months
  */
  monthChange(month)
  {
    this.setState({month: month});
  }

  /* 
    Allow age state to change when user selects an age group
  */
  ageChange(age)
  {
    this.setState({age: age});
  }

  /*
    Allow gender state to change when user selects a gender
  */
  genderChange(gender)
  {
    this.setState({gender: gender});
  }

  /*
    Submit the inputs of the registration form
  */
  register(event)
  {
    event.preventDefault();

    // Convert the email input to the correct storage format
    let email = this.state.email.replace("@", "%40");

    this.setState({loading: true, registrationResult: ""});

    // Disable input while fetch is being processed
    document.getElementById("submitRegistrationButton").disabled = true;
    
    fetch("http://localhost:80/register", 
      {
        method: "POST",
        body: 'email=' + email + '&password=' + this.state.password,
        headers: 
        {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    )
    
    .then(function(response) 
      {
        if (response.ok) 
        {
          return response.json();
        }
        
        throw new Error("Network response was not ok");
      }
    )
      
    .then(function(result) 
      {
        let elems = document.getElementsByClassName("interactive") // Get the input elements
          
        for (let i = 0; i < elems.length; i++)
        {
          elems[i].disabled = false; // Reenable the input elements
        }

        this.setState(
          {
            registration: false, 
            loading: false, 
            email: "", 
            password: "",
            registrationResult: "success"
          }
        );
      }
      .bind(this)
    )
      
    .catch(function(error) 
      {
        this.setState(
          {
            email: "", 
            password: "", 
            registrationResult: "failed", 
            loading: false
          }
        );

        let elems = document.getElementsByClassName("regInput") // Get only the registration inputs
        
        for (let i = 0;i<elems.length;i++){
          elems[i].disabled = false; // Re-enable only the registration inputs
        }
        
        document.getElementById("regFormInputs").reset();
      }
      .bind(this)
    );
  }

  /*
    Submit the inputs of the login form
  */
  login(event)
  {
    event.preventDefault();
    this.setState({loading: true, loginFailed: false, registrationResult: ""});
    
    // Get the inputs of the page
    let elems = document.getElementsByClassName("interactive")
    
    for (let i = 0; i < elems.length; i++)
    {
      elems[i].disabled = true; // Disable the inputs while the fetch is being processes
    }
    
    // Convert the email input to the correct format
    let email = this.state.email.replace("@", "%40");
    
    fetch("http://localhost:80/login", 
      {
        method: "POST",
        body: 'email=' + email + '&password=' + this.state.password,
        headers: 
        {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }
    )
    
    .then(function(response)
      {
        if (response.ok) 
        {
          return response.json();
        }

        throw new Error("Network response was not ok.");
      }
    )
    
    .then(function(result)
      {
        this.setState({loginToken: result.token});
        this.getOffences();
        this.getAreas();
      }
      .bind(this)
    )
    
    .catch(function(error) 
      {
        this.setState({email: "", password: "", loading: false, loginFailed: true});
        let elems = document.getElementsByClassName("interactive") // Get the input elements of the page
        
        for (let i = 0; i < elems.length ; i++)
        {
          elems[i].disabled = false; // re-enable the input elements
        }
        
        document.getElementById("logFormInputs").reset();
      }
      .bind(this)
    );
  }

  /*
    Log out and return the states to logged out values
  */
  logout()
  {
    this.setState(
      {
        loading: false,
        registration: false,
        registrationResult: "",
        loginFailed: false,
        email: "",
        password: "",
        loginToken: null,
        offences: [],
        areas: [],
        loggedIn: false,
        syncLoad: 0,
        offence: "",
        area: "",
        age: "",
        year: "",
        month: "",
        gender: "",
        results: [],
      }
    );
  }

  /*
    Get an array of the offences in the database
  */
  getOffences()
  {
    fetch("http://localhost:80/offences")
      .then(function(response) 
        {
          if (response.ok) 
          {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        }
      )

      .then(function(result)
        {
          this.setState({offences: result.offences})
          
          // If areas has not been returned, notify the syncLoader that offences have been returned
          if (this.state.syncLoad === 0)
          {
            this.setState({syncLoad: 1});
          }

          // If areas have alread been loaded, clear the synLoader and re-enable inputs
          else 
          {
            let elems = document.getElementsByClassName("interactive")
            
            for (let i = 0; i < elems.length; i++)
            {
              elems[i].disabled = false;
            }

            this.setState({syncLoad: 0, loading: false, loggedIn: true});
          }
        }
        .bind(this)
      )
      
      .catch(function(error) {
      });
  }

  // Get an array of the areas in the database
  getAreas()
  {
    fetch("http://localhost:80/areas")
      .then(
        function(response)
        {
          if (response.ok) 
          {
            return response.json();
          }
            throw new Error("Network response was not ok.");
        }
      )

      .then(
        function(result)
        {
          this.setState({areas: result.areas});
          
          // If offences have not been returned, notify the syncLoader that areas have been returned
          if (this.state.syncLoad === 0)
          {
            this.setState({syncLoad: 1});
          } 

          // If offences have already been loaded, clear the sync loader and re-enable inputs
          else 
          {
            let elems = document.getElementsByClassName("interactive")
            
            for (let i = 0; i < elems.length; i++)
            {
              elems[i].disabled = false;
            }
            
            this.setState({syncLoad: 0, loading: false, loggedIn: true});
          }
        }
        .bind(this)
      )
      
      .catch(function(error) {
      });
}

  /*
    Send a query to the API and get the statistics back
  */
  search(event)
  {
    event.preventDefault();
    //The parameters of the call
    let getParam = { method: "GET" };
    let head = { Authorization: `Bearer ${this.state.loginToken}` };
    getParam.headers = head;

    //The URL
    const baseUrl = "http://localhost:80/search?";
    this.setState({loading: true});

    let query = "offence=" + this.state.offence;
    
    if (this.state.area !== "")
    {
      query = query.concat("&area=" + this.state.area);
    }

    if (this.state.age !== "")
    {
      query = query.concat("&age=" + this.state.age);
    }

    if (this.state.year !== "")
    {
      query = query.concat("&year=" + this.state.year);
    }

    if (this.state.month !== "")
    {
      query = query.concat("&month=" + this.state.month);
    }

    if (this.state.gender !== "")
    {
      query = query.concat("&gender=" + this.state.gender);
    }
    
    const url = baseUrl + query;

    let elems = document.getElementsByClassName("interactive") // Get inputs of the page
    
    for (let i = 0; i < elems.length; i++)
    {
      elems[i].disabled = true; // Diable the inputs while fetch is being performed
    }

    this.setState({results: []});

    fetch(encodeURI(url), getParam)
      .then(function(response)
        {
          if (response.ok) 
          {
            this.setState({rejectedSearch: false});
            return response.json();
          }

          throw new Error("Network response was not ok.");
        }
    .bind(this)
    )
      
    .then(function(result) 
      {

        for (let i = 0; i < result.result.length; i++)
        {
          
          if (result.result[i].total > 0)
          {
            this.setState({results: this.state.results.concat(result.result[i])});
          }
        }

        let elems = document.getElementsByClassName("interactive") // Get the inputs of the page
            
        for (let i = 0; i < elems.length; i++)
        {
          elems[i].disabled = false; // re-enable the inputs
        }
            
        this.setState({loading: false});
      }
      .bind(this)
    )
    .catch(
      function(error) 
      {
        let elems = document.getElementsByClassName("interactive") // Get the inputs of the page
            
        for (let i = 0;i<elems.length;i++)
        {
          elems[i].disabled = false; //re-enable the inputs
        }
          
        this.setState({loading: false, rejectedSearch: true});
      }
      .bind(this)
    );
  }

  render(){
      
    return(
      <div id="app">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <Header
          openRegistration={this.openRegistration}
          logout={this.logout}
          loggedIn={this.state.loggedIn}
        />
        
        <Loader loading={this.state.loading}/>
        
        <Hero
          loginToken={this.loginToken}
          loginFailed={this.state.loginFailed}
          emailChange={this.emailChange}
          passwordChange={this.passwordChange}
          login={this.login}
          loggedIn={this.state.loggedIn}
          registrationResult={this.state.registrationResult}
        />
        
        <RegForm
          registration={this.state.registration}
          registrationResult={this.state.registrationResult}
          closeRegistration={this.closeRegistration}
          emailChange={this.emailChange}
          passwordChange={this.passwordChange}
          register={this.register}
        />

        <SearchForm 
          loggedIn={this.state.loggedIn}
          offences={this.state.offences}
          offenceChange={this.offenceChange}
          areas={this.state.areas}
          areaChange={this.areaChange}
          year={this.state.year}
          yearChange={this.yearChange}
          month={this.state.month}
          monthChange={this.monthChange}
          age={this.state.age}
          ageChange={this.ageChange}
          gender={this.state.gender}
          genderChange={this.genderChange}
          search={this.search}
          rejectedSearch={this.state.rejectedSearch}
        />

        <Output
          loggedIn={this.state.loggedIn}
          results={this.state.results}
        />
        
        <Footer/>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
