CREATE OR REPLACE FUNCTION public.new_session(user_name text)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
	user_id integer;
	session_id int8;
begin
	select id into user_id from users where username = user_name;
	select (extract(epoch from now()) * 1000000)::int8 into session_id;
	insert into sessions values (session_id, user_id, now());
	return session_id;
end;
$function$
;
