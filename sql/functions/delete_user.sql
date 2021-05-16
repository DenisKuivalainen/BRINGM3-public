CREATE OR REPLACE FUNCTION public.delete_user(session_id text, user_ text)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
	session_excists integer;
	head boolean;
	id_user integer;
	id_from_sessions integer;
begin
	select user_id into id_from_sessions from sessions where id = session_id;
	select count(*) into session_excists from sessions where id = session_id;
	select is_head into head from users where id = id_from_sessions;
	if 	not(session_excists = 1) or not(head) then return id_user;
	end if;

	select id into id_user from (select * from users where family_id = (select family_id from users where id = id_from_sessions)) as users_of_family where username = user_ and is_head = false;
	delete from users where id = id_user;
	delete from sessions where user_id = id_user;
	
	return id_user;
end;
$function$
;
