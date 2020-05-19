import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import User from '../entity/User';

const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

export default class AuthController {
	private userRepository = getRepository( User );

	async register( request: Request ) {
		const { email, password } = request.body;
		const errors = {} as any;

		const userEmail = await this.userRepository.findOne( { email } );
		if ( userEmail ) {
			errors.email = 'This email is already registered.';
		}

		if ( !email.length ) {
			return { error: { errors: { email: 'Email is required!' } } };
		}

		if ( !password.length ) {
			errors.password = 'Password is required!';
		}

		if ( Object.keys( errors ).length ) {
			return { error: { errors } };
		}

		const userObject = this.userRepository.create( request.body );
		const user = await this.userRepository.save( userObject );
		return { data: { user } };
	}

	async login( request: Request, response: Response ) {
		if ( !request.body.email ) {
			return { error: { errors: { password: 'Email is required!' } } };
		}

		const user = await this.userRepository.findOne( { email: request.body.email } );

		if ( !user ) {
			return {
				error: {
					errors: {
						email: 'No user found!',
					},
				},
			};
		}

		const isValid = bcrypt.compareSync( request.body.password, user.password );

		if ( isValid ) {
			const token = jwt.sign( { user: { id: user.id } }, 'secret-to-update', { expiresIn: '20160m' } );
			response.cookie( 'token', token, { httpOnly: true } );
			return { data: { user: { id: user.id, email: user.email } } };
		}

		return { error: { errors: { password: 'Password not valid!' } } };
	}

	async logout( request: Request, response: Response ) {
		response.clearCookie( 'token' );
		return { data: 'Logged out successfully' };
	}

	async check( request: Request, response: Response ) {
		const user = await this.userRepository.findOne( request.user.id );
		// Refresh token.
		const token = jwt.sign( { user: { id: user.id } }, 'secret-to-update', { expiresIn: '20160m' } );
		response.cookie( 'token', token, { httpOnly: true } );
		return { data: { user: { id: user.id, email: user.email } } };
	}
}
