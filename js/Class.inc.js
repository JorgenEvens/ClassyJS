/**
 * ClassyJS Object Oriented
 * Provides Object Oriented programming support to Javascript. 
 * Providing as close of object orientation as other languages.
 * 
 * Maintainer: Jorgen Evens
 * Contact: jorgen.evens@gmail.com
 *  
 */
Object = new (function Class( type_definitions, parent_type ){
	// Generates new type.
	
	if( !type_definitions )
		type_definitions = [];
	
	var gen_proto = false,
	
		get_proto = function() {
			// Make the instanceof operator work by generating dummies of self;
			
			var prototype;
			
			gen_proto = true;
			prototype = new constructor();
			gen_proto = false;
			
			return prototype;
		},
		
		error_redeclare = function ( name ) {
			return 'You cannot define ' + name + ' twice.';
		},
		error_scope_narrowing = function( name ) {
			return name + ' is protected. Cannot make the scope of this function less narrow.';
		},
		
		add_to_target = function( target, item_name, item ) {
			if( typeof item === 'function' ) {
				target[ item_name ] = function(){
					return item.apply( target, arguments );
				};
			} else {
				target[ item_name ] = item;
			}
		},
		
		constructor = function(){
			// Initializes an object.
			
			if( gen_proto )
				return this;
			
			var target = {},		// Target of all properties and methods
				p = get_proto(),	// Target of all public properties and methods
				type_i = type_definitions.length, // Current type definition
				type_definition;	// Holds the type definition during loop
			
			for( ; type_i--; ){
				type_definition = type_definitions[ type_i ];
				
				(function () {
					// Definition scope
					
					var _public = {},
						_protected = {},
						parent = {},
						item_name;
					
					// Execute definition scope
					new (function () {
						// Perform fast execution by not evaluating the source
						// and passing public, protected and parent as arguments.
						if( type_definition.fast_exec === true ) {
							type_definition( _public, _protected, parent ); 
						} else {
							this.pu = _public,
							this.pr = _protected,
							this.pa = parent;
							
							eval( 'var public=this.pu,protected=this.pr,parent=this.pa;(' + type_definition + ')()' );
						}
					})();
					
					// Handle public properties and methods
					/*******************************************************************************************/
					for( item_name in _public ){ 
						// public methods & properties
						
						(function ( item, item_name ) { 
							// Wrap to maintain context variables.
							
							if( target[ item_name ] ) {
								// item_name is already present on the object, move it to parent.
								
								if( parent[ item_name ] )
									throw error_redeclare( item_name );
								
								if( !p[ item_name ] )
									throw error_scope_narrowing( item_name );
								
								parent[ item_name ] = target[ item_name ];
							}
							
							add_to_target( target, item_name, item );
							
							// Make function public available.
							// Improvement possible if browser IE8+ or other.
							// Use __defineSetter__ and __defineGetter__ or Object.defineProperty
							p[ item_name ] = target[ item_name ];
							
							
						})( _public[item_name], item_name );
						
					}
					/*******************************************************************************************/
					
					// Handle protected properties and methods
					/*******************************************************************************************/
					
					for( item_name in _protected ){ 
						// protected methods & properties
						
						(function( item, item_name ){ 
							// Wrap to maintain context variables.
							
							if( p[ item_name ] )
								delete p[ item_name ];
							
							if( target[ item_name ] ){
								// item_name is already present on the object, move it to parent.
								
								if( parent[ item_name ] )
									throw error_redeclare( item_name );
								
								parent[ item_name ] = target[ item_name ];
							}
							
							add_to_target( target, item_name, item );
							
						})( _protected[ item_name ], item_name );
						
					}
					/*******************************************************************************************/
				}());
			}
		
		// Call constructor with arguments of current call.
		if( target.construct )
			target.construct.apply( null, arguments );
		
		return p;
	};

	// If a parent type is given, do a dummy inherit so the instanceof operator is happy.
	if( parent_type )
		constructor.prototype = parent_type;
	
	constructor.extend = function( type_definition ){
		// Collect the definitions of current class, and add the new definition and create the new type.
		
		var tmp = type_definitions.slice();
		
		// Perform fast execution by not evaluating the source
		// and passing public, protected and parent as arguments.
		if( type_definition.length === 0 ) {
			type_definition = type_definition.toString();
		} else {
			type_definition.fast_exec = true;
		}
		
		tmp.unshift( type_definition );
		return new Class( tmp, get_proto() );
	};
	
	return constructor;
})();