import React from "react";

/* Header */
export class Header extends React.Component {
  render(){
    return(
      <header>
        <img src="qcdbIcon.png" alt="icon"/>
        
        <RegisterButton 
          openRegistration={this.props.openRegistration}
          loggedIn={this.props.loggedIn}
        />
        
        <LogOutButton
          loggedIn={this.props.loggedIn}
          logout={this.props.logout}
        />
      </header>
    );
  }
}

/* 
  Button that renders into the header when the user is not logged in. 
  When clicked, a registration form is rendered 
*/
class RegisterButton extends React.Component 
{
  render()
  {
	  if (this.props.loggedIn === false){
		return(
      <button 
        className="interactive buttonClass" 
        onClick={this.props.openRegistration}
      >
        Register
      </button>
		);
    }
    
    else 
    {
		return null;
	  }
	}
}

/* 
  Button that renders into the header when the user is logged in.
  When clicked, it logs the user out 
*/
class LogOutButton extends React.Component
{
  render(){
    if (this.props.loggedIn === false){
      return null;
    } 
    
    else 
    {
      return(
        <button className="buttonClass" onClick={this.props.logout}>Log out</button>
      );
    }
  }
}