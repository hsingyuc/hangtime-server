import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { Routes } from './routes';
import AuthController from './controller/AuthController';

require( 'dotenv' ).config();

const connectionOptions = {
	type: 'mysql',
	url: process.env.DATABASE_URL,
	entities: [
		`${__dirname}/entity/**/*.js`,
	],
	autoSchemaSync: true,
};

createConnection( connectionOptions as any ).then( async () => {
	// create express app
	const app = express();
	app.use( ( req, res, next ) => {
		res.header( 'Access-Control-Allow-Credentials', 'true' );
		// @todo This address should be changed to be dynamic.
		res.header( 'Access-Control-Allow-Origin', process.env.CLIENT_URL );
		res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
		next();
	} );
	app.use( bodyParser.json() );
	app.use( cookieParser() );

	// register express routes from defined application routes
	Routes.forEach( ( route ) => {
		const middleware = route.middleware
			? route.middleware
			: ( req: Request, res: Response, next: Function ) => next();
		( app as any )[route.method](
			route.route,
			middleware,
			( req: Request, res: Response, next: Function ) => {
				const result = ( new ( route.controller as any )() )[route.action]( req, res, next );
				if ( result instanceof Promise ) {
					result.then( ( promiseResult ) => (
						promiseResult !== null && promiseResult !== undefined
							? res.send( promiseResult )
							: undefined
					) );
				} else if ( result !== null && result !== undefined ) {
					res.json( result );
				}
			},
		);
	} );

	// setup express app here
	// ...

	// start express server
	app.listen( process.env.PORT || 8080 );

	console.log( 'Express server has started on port 8080.' );
} ).catch( ( error ) => console.log( error ) );
