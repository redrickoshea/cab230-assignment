import React from "react";

/* Area where user inputs their search queries by clicking desired options form tables */
export class SearchForm extends React.Component 
{
	constructor(props)
	{
	  super(props);
	  this.handleOffenceChange = this.handleOffenceChange.bind(this);
	  this.handleAreaChange = this.handleAreaChange.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleMonthChange = this.handleMonthChange.bind(this);
		this.handleAgeChange = this.handleAgeChange.bind(this);
		this.handleGenderChange = this.handleGenderChange.bind(this);
	}
  
	handleOffenceChange(event)
	{
	  this.props.offenceChange(event.target.value);
	}
  
	handleAreaChange(event)
	{
	  this.props.areaChange(event.target.value);
	}
  
	handleYearChange(event)
	{
	  this.props.yearChange(event.target.value);
	}

	handleMonthChange(event)
	{
		this.props.monthChange(event.target.value);
	}
  
	handleAgeChange(event)
	{
	  this.props.ageChange(event.target.value);
	}

	handleGenderChange(event)
	{
		this.props.genderChange(event.target.value);
	}
  
	render()
	{
		if (this.props.loggedIn === false)
		{
			return null;
		} 
		
		else 
		{
			return(
				<div id="search">
				<form onSubmit={this.props.search}>
					<h2>Search</h2>
					<label>Offence:</label>
					<input
					className="input interactive"
					name="offence"
					type="text"
					value={this.props.offence}
					onChange={this.handleOffenceChange}
					/>
					<br/>
					<OffencesTable
					offences={this.props.offences}
					/>
					<br/>
					<label>Area:</label>
					<input
						className="input interactive"
						name="area"
						type="text"
						value={this.props.area}
						onChange={this.handleAreaChange}
					/>
					<br/>
					<AreasTable
					areas={this.props.areas}
					/>
					<br/>
					<label>Year:</label>
					<input
						className="input interactive"
						name="year"
						type="text"
						value={this.props.year}
						onChange={this.handleYearChange}
					/>
					<br/>
					<label>Month:</label>
					<input
						className="input interactive"
						name="month"
						type="text"
						value={this.props.month}
						onChange={this.handleMonthChange}
					/>
					<br/>
					<label>Age:</label>
					<select 
						className="input interactive"
						value={this.props.age}
						onChange={this.handleAgeChange}
					>
					<option value="">Any</option>
					<option value="juvenile">Juvenile</option>
					<option value="adult">Adult</option>
					</select>
					<br/>
					<label>Gender:</label>
					<select 
						className="input interactive"
						value={this.props.gender}
						onChange={this.handleGenderChange}
					>
					<option value="">Any</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					</select>
					<br/>
					<input 
						className="interactive buttonClass"
						type="submit"
						value="Search"
					/>
					<RejectedSearch rejectedSearch={this.props.rejectedSearch}/>
				</form>
				</div>
			);
	  }
	}
}


// The offences section of the search form
class OffencesTable extends React.Component 
{
	constructor(props)
	{
	  super(props);
	  this.sortOffencesTable = this.sortOffencesTable.bind(this);
	}
	  
	sortOffencesTable() 
	{
		let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		
		table = document.getElementById("offencesTable");
	  switching = true;
		
		// Set the sorting direction to ascending:
	  dir = "asc"; 
		
		/* Make a loop that will continue until
	  no switching has been done: */
		while (switching) 
		{
			// Start by saying: no switching is done:
			switching = false;
			rows = table.rows;

			/* Loop through all table rows (except the
			first, which contains table headers): */
			for (i = 1; i < (rows.length - 1); i++) 
			{
				// Start by saying there should be no switching:
				shouldSwitch = false;
				
				/* Get the two elements you want to compare,
				one from current row and one from the next: */
				x = rows[i].getElementsByTagName("td")[0];
				y = rows[i + 1].getElementsByTagName("td")[0];
				
				/* Check if the two rows should switch place,
				based on the direction, asc or desc: */
				if (dir === "asc") 
				{
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) 
					{
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				} 
				
				else if (dir === "desc") 
				{
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				}
			}
			
			if (shouldSwitch) 
			{
				/* If a switch has been marked, make the switch
				and mark that a switch has been done: */
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				
				// Each time a switch is done, increase this count by 1:
				switchcount ++; 
			} 
			
			else 
			{
				/* If no switching has been done AND the direction is "asc",
				set the direction to "desc" and run the while loop again. */
				if (switchcount === 0 && dir === "asc") {
				dir = "desc";
				switching = true;
				}
			}
	  }
	}
  
	render()
	{
	  return(
			<div className="tableClass">
				<table id="offencesTable">
				<tbody>
					<tr>
					<th onClick={this.sortOffencesTable}>Offence <i className="fa fa-sort"/>
					</th>
					</tr>
					{this.props.offences.map(offence => (
					<tr><td>{offence}</td></tr>
					))}
				</tbody>
				</table>
			</div>
	  );
	}
}

class AreasTable extends React.Component 
{
	constructor(props)
	{
	  super(props);
	  this.sortAreasTable = this.sortAreasTable.bind(this);  
	}
  
	sortAreasTable() 
	{
	  let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		
		table = document.getElementById("areasTable");
	  switching = true;
		
		// Set the sorting direction to ascending:
	  dir = "asc"; 
		
		/* Make a loop that will continue until
	  no switching has been done: */
		while (switching) 
		{
			// Start by saying: no switching is done:
			switching = false;
			rows = table.rows;
			
			/* Loop through all table rows (except the
			first, which contains table headers): */
			for (i = 1; i < (rows.length - 1); i++) 
			{
				// Start by saying there should be no switching:
				shouldSwitch = false;
				
				/* Get the two elements you want to compare,
				one from current row and one from the next: */
				x = rows[i].getElementsByTagName("td")[0];
				y = rows[i + 1].getElementsByTagName("td")[0];
				
				/* Check if the two rows should switch place,
				based on the direction, asc or desc: */
				if (dir === "asc") 
				{
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) 
					{
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				} 
				
				else if (dir === "desc") 
				{
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) 
					{
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				}
			}

			if (shouldSwitch) 
			{
				/* If a switch has been marked, make the switch
				and mark that a switch has been done: */
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				
				// Each time a switch is done, increase this count by 1:
				switchcount ++; 
			} 
			
			else 
			{
				/* If no switching has been done AND the direction is "asc",
				set the direction to "desc" and run the while loop again. */
				if (switchcount === 0 && dir === "asc") {
				dir = "desc";
				switching = true;
				}
			}
	  }
	}
  
	render()
	{
	  return(
			<div className="tableClass">
				<table id="areasTable">
				<tbody>
					<tr>
					<th onClick={this.sortAreasTable}>Area <i className="fa fa-sort"/>
					</th>
					</tr>
					{this.props.areas.map(area => (
					<tr><td>{area}</td></tr>
					))}
				</tbody>
				</table>
			</div>
	  );
	}
}


// Response to a rejected search
class RejectedSearch extends React.Component
{
	render()
	{
		if (this.props.rejectedSearch === false)
		{
			return null;      
		} 
		
		else 
		{
			return(
				<p>Please enter an offence</p>
			);
	  }
	}
}