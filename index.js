var fs = require( "fs" );
var path = require( "path" );
var slash = require( "slash" );
var through = require( "through2" );

module.exports = function( jadeFile, options ) {
	var scriptTags = "";
	options.root = options.root || process.cwd();

	var write = function( file, encoding, callback ) {
		if( file.path != "undefined" ) {
			scriptTags = scriptTags + "script(src=\"" + slash( path.relative( options.root, file.path ) ) + "\")" + "\n";
		}
		this.push( file );
		callback();
	};

	var flush = function( callback ) {
		fs.writeFile( jadeFile, scriptTags, callback );
	};

	return through.obj( write, flush );
};
