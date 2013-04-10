var Person = Object.extend(function(){
	
	var _name;
	var _gender;
	
	protected.setName = function( name ){
		_name = name;
	};
	
	protected.setGender = function( gender ){
		_gender = gender;
	};
	
	public.getName = function(){
		return _name;
	};
	
	public.getGender = function(){
		return _gender;
	};
	
	public.construct = function( name, gender ){
		_name = name;
		_gender = gender;
	};
	
});

var Employee = Person.extend(function(){
	
	// Import other libraries.
	var Project = Data.Project;
	
	var _position;
	var _project;
	
	public.setPosition = function( position ){
		_position = position;
	};
	
	public.getPosition = function(){
		return _position;
	};
	
	public.construct = function( name, gender, position ) {
		parent.construct( name, gender );
		
		_position = position;
		_project = new Project();
		_project.setName( 'TestProject' );
	};
	
	public.getCurrentProject = function(){
		return _project;
	};
	
});

var Data = {};

Data.Project = Object.extend(function(){
	
	var _name = "Default";
	
	public.getName = function(){
		return _name;
	};
	
	public.setName = function( name ){
		_name = name;
	};
	
});

var demos = {
		inheritance: function(){
			var Developer = new Employee( 'Jorgen Evens', 'Male', 'Developer' );
			var Designer = new Employee( 'Stefan Hellings', 'Male', 'Designer' );
			var Client = new Person( 'John Doe', 'Male' );
			
			var typeTest = function( obj, type ){
				return ( ( obj instanceof type ) ? '<span style="color: green;">Yes</span>' : '<span style="color: red;">No</span>' );
			};
			
			var pre = document.getElementById( 'demo1' );
			
			pre.innerHTML += 'Developer instanceof Employee? ' + typeTest( Developer, Employee ) + "\n";
			pre.innerHTML += 'Developer instanceof Person? ' + typeTest( Developer, Person ) + "\n";
			
			pre.innerHTML += 'Designer instanceof Employee? ' + typeTest( Designer, Employee ) + "\n";
			pre.innerHTML += 'Designer instanceof Person? ' + typeTest( Designer, Person ) + "\n";
			
			pre.innerHTML += 'Client instanceof Employee? ' + typeTest( Client, Employee ) + "\n";
			pre.innerHTML += 'Client instanceof Person? ' + typeTest( Client, Person ) + "\n";
		},
		calling_functions: function(){
			var Developer = new Employee( 'Jorgen Evens', 'Male', 'Developer' );
			var Client = new Person( 'John Doe', 'Male' );
			
			var pre = document.getElementById( 'demo2' );
			
			pre.innerHTML += 'Developer.getPosition(): <b>' + Developer.getPosition() + "</b>\n";
			pre.innerHTML += 'Developer.getName(): <b>' + Developer.getName() + "</b>\n";
			
			pre.innerHTML += 'Client.getName(): <b>' + Client.getName() + "</b>\n";
		},
		imports: function(){
			var Developer = new Employee( 'Jorgen Evens', 'Male', 'Developer' );
			
			var pre = document.getElementById( 'demo3' );
			
			pre.innerHTML += 'Developer.getCurrentProject().getName(): <b>' + Developer.getCurrentProject().getName() + "</b>\n";
		}
};

window.onload = function(){
	
	demos.inheritance();
	demos.calling_functions();
	demos.imports();
	
};
