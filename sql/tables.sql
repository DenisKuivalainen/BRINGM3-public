create table families (
	id int primary key
);

create table users (
	id int primary key,
	username varchar(20) not null,
	pass varchar(100) not null,
	nickname varchar(20) not null,
	family_id int,
	is_head boolean not null,
	can_add boolean,
	can_reserve boolean,
	can_delete boolean,
	
	foreign key(family_id) references families(id)
);

create table sessions (
	id varchar(100) primary key,
	user_id int,
	last_use date,
	
	foreign key(user_id) references users(id) on delete cascade
);

create table items (
	id int primary key,
	title char(50) not null,
	description char(150) not null,
	category int not null,
	family_id int,
	added_id int not null,
	reserved_id int,

	foreign key(family_id) references families(id)
);