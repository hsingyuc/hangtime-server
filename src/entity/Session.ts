import {
	CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import User from './User';

export enum Type {
	REPEATER = 'repeater',
	MAXHANG = 'maxhang',
	PINCH = 'pinch'
}

export enum Edge {
	SMALL_CRIPMS = 'Small Crimps',
	E8MM = '8mm',
	E10MM = '10mm',
	E15MM = '15mm',
	E20MM = '20mm'
}

@Entity()
export class Session {
	@PrimaryGeneratedColumn()
	id: number;

	@Column( {
		type: 'enum',
		enum: Type,
	} )
	type: Type;

	@Column( {
		type: 'enum',
		enum: Edge,
	} )
	edge: Edge;

	@Column( {
		type: 'enum',
		enum: [1, 2],
		default: 2,
	} )
	numberOfhands: boolean

	@Column( { default: '00:10' } )
	duration: string;

	@Column( { default: 30 } )
	repRest: number;

	@Column( { default: 30 } )
	setRest: number;

	@Column( {
		type: 'float', precision: 4, scale: 2, default: 5,
	} )
	weight: number;

	@Column( { default: 5 } )
	sets: number;

	@Column( { default: 1 } )
	reps: number;

	@CreateDateColumn( { name: 'createdAt' } ) 'createdAt': Date;

	@UpdateDateColumn( { name: 'updatedAt' } ) 'updatedAt': Date;

	@ManyToOne( () => User, ( user ) => user.sessions )
	user: User;

	@Column()
	isSuccess: boolean;
}
