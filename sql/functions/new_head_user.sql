CREATE OR REPLACE FUNCTION public.new_head_user(username text, pass text, nickname text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
	family_id integer;
	user_id integer;
begin
	select max(id) into family_id from families;
	insert into families values (family_id + 1);
	select max(id) into user_id from users;
	insert into users values (user_id + 1, username, pass, nickname, family_id + 1, true, true, true, true);
	return user_id + 1;
end;
$function$
;
