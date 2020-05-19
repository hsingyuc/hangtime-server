import {
	Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany,
} from 'typeorm';
import { Session } from './Session';

const bcrypt = require( 'bcrypt' );

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@BeforeInsert()
	@BeforeUpdate()
	hashPassword() {
		if ( this.password ) {
			this.password = bcrypt.hashSync( this.password, 10 );
		}
	}

	@OneToMany( () => Session, ( session ) => session.user )
	sessions: Session[];
}
