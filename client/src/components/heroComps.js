import React from "react";

/* 
	Hero section. Contains the login form when the user is logged out, and the search form
	when the user is logged in 
*/
export class Hero extends React.Component 
{
	render()
	{
		return(
			<div id="hero">
				<LoginForm
					loginToken={this.props.loginToken}
					email={this.props.email}
					password={this.props.password}
					emailChange={this.props.emailChange}
					passwordChange={this.props.passwordChange}
					login={this.props.login}
					loginFailed={this.props.loginFailed}
					loggedIn={this.props.loggedIn}
					registrationResult={this.props.registrationResult}
				/>
			</div>
		);
	}
}

/* 
	Login form 
*/
class LoginForm extends React.Component 
{
	constructor(props)
	{
	  super(props);
	  this.handleEmailChange = this.handleEmailChange.bind(this);
	  this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}
  
	handleEmailChange(event)
	{
	  this.props.emailChange(event.target.value);
	}
  
	handlePasswordChange(event)
	{
	  this.props.passwordChange(event.target.value);
	}
  
	render()
	{
		if (this.props.loggedIn === true)
		{
		return (
		  <div className="heroForm">
			<h3>Welcome</h3>
			<p>Please scroll down to begin searching</p>
		  </div>
		);
		} 
		
		else 
		{
		  return(
				<div className="heroForm">
				
				<form id="logFormInputs" onSubmit={this.props.login} autoComplete="off">
					<h3>Login</h3>
					<div className="field">
					<label>
						Email:
					</label>
					<input
						className="input interactive"
						name="email"
						type="text"
						value={this.props.email}
						onChange={this.handleEmailChange}
					/>
					</div>
					<div className="field">
					<label>
						Password:
					</label>              
					<input
						className="input interactive passInput"
						name="password"
						type="text"
						value={this.props.password}
						onChange={this.handlePasswordChange}
					/>
					</div>
					<br/>
					<input
					className="interactive buttonClass" 
					id="loginButton" 
					type="submit" 
					value="Login"/>
				</form>
				<LogResponse 
					loginFailed={this.props.loginFailed}
					registrationResult={this.props.registrationResult}
				/>
				</div>
			);
	  }
	}
}

/*
	Renders a response to creation of an account or failure to login
*/
class LogResponse extends React.Component 
{
	render()
	{
		// Registration success
		if (this.props.registrationResult === "success")
		{
			return(
				<p>Your account has successfully been created</p>
			);
		} 
		
		// Login failure
		if (this.props.loginFailed === true)
		{
			return(
				<p>Oops! Your login has failed. Check your email and password</p>
			)
		} 
		
		else 
		{
			return null;
		}
	}
}



