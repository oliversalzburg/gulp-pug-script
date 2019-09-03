"use strict";

const fs      = require( "fs" );
const mkdirp  = require( "mkdirp" );
const path    = require( "path" );
const slash   = require( "slash" );
const through = require( "through2" );

module.exports = ( pugFile, options ) => {
	let scriptTags = "";
	options.root = options.root || process.cwd();

	options.includes = options.includes || [];

	const renderInclude = sourceFileName => `include /${sourceFileName}${"\n"}`;
	const renderFile    = sourceFileName => `script(src="${sourceFileName}")${"\n"}`;

	const write = function write( file, encoding, callback ) {
		if( file.path != "undefined" ) {
			const relativePath = path.relative( options.root, file.path );
			const normalized   = slash( relativePath );
			let sourceFileName = normalized;

			if( options.transform ) {
				sourceFileName = options.transform( sourceFileName );
			}

			if( options.version ) {
				sourceFileName = sourceFileName + "?v=" + options.version;
			}

			scriptTags = scriptTags + renderFile( sourceFileName );
		}

		this.push( file );
		callback();
	};

	const flush = ( callback ) => {
		const dirname = path.dirname( pugFile );

		scriptTags = options.includes.map( renderInclude ).join( "" ) + scriptTags;

		mkdirp( dirname, ( error ) => {
			if( !error ) {
				fs.writeFile( pugFile, scriptTags, callback );
			}
		} );
	};

	return through.obj( write, flush );
};
