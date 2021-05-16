CREATE OR REPLACE FUNCTION public.add_user(session_id text, username text, nickname text, add_ boolean, reserve_ boolean, delete_ boolean)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
	session_excists integer;
	head boolean;
	id_family integer;
	id_user integer;
begin
	select count(*) into session_excists from sessions where id = session_id;
	select is_head into head from users where id = (select user_id from sessions where id = session_id);
	if 	not(session_excists = 1) or not(head) then return id_user;
	end if;

	select family_id into id_family from users where id = (select user_id from sessions where id = session_id);
	select max(id) into id_user from users;
	insert into users values (id_user + 1, username, null, nickname, id_family, false, add_, reserve_, delete_);
	return id_user + 1;
end;
$function$
;
