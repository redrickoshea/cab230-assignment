import React from "react";

/* 
	Loading symbol that appears whenever the page is loading something 
*/
export class Loader extends React.Component 
{
	render()
	{
		if (this.props.loading === true)
		{
			return(
				<div id="loader"/>
			);
		} 
		
		else 
		{
		return null;
	  }
	}
}

/* 
	Renders an error message if the users registration has failed 
*/
class RegResponse extends React.Component 
{
	render()
	{
		if (this.props.registrationResult === "failed")
		{
			return(
				<p>Oops! Your registration has failed.</p>
			);
		} 
		
		else 
		{
			return null;
	  }
	}
}

/* 
	Registration form that is rendered floating over the page when the 
	user clicks register
*/
	export class RegForm extends React.Component 
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
		if (this.props.registration === true)
		{
		  return(
		  	<div id="regForm">
					<div id="closeRegButton">
			  	<button onClick={this.props.closeRegistration}>X</button>
					</div>
  
				<form id="regFormInputs" onSubmit={this.props.register} autoComplete="off">
					<h3 className="heading">Register</h3>
					<div className="field">
						<label>Email:</label>
						<input
							className="input interactive regInput"
							name="email"
							type="text"
							value={this.props.email}
							onChange={this.handleEmailChange}
						/>
			  	</div>
					<div className="field">
					<label>Password:</label>
					<input
						className="input interactive regInput passInput"
						name="password"
						type="text"
						value={this.props.password}
						onChange={this.handlePasswordChange}
					/>
					</div>
					<br/>
					<input
					className="interactive regInput buttonClass"
					id="submitRegistrationButton"
					type="submit"
					value="Register"
					/>
				</form>
				<RegResponse registrationResult={this.props.registrationResult}/>
		  	</div>
			);
		} 
		
		else 
		{
		return null;
	  }
	}
}

