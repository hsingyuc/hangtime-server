import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import User from '../entity/User';

export default class UserController {
	private userRepository = getRepository( User );

	async getSessions( request: Request, response: Response ) {
		if ( request.user.id !== parseInt( request.params.id, 10 ) ) {
			response.sendStatus( 401 );
		}

		const user = await this.userRepository.findOne( request.params.id, { relations: ['sessions'] } );

		if ( !user ) {
			return { error: 'User not found!' };
		}

		return { data: user.sessions };
	}
}
