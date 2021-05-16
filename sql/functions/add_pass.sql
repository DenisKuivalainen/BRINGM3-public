CREATE OR REPLACE FUNCTION public.add_pass(user_ text, pass_ text)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
	id_user integer;
begin
	select id into id_user from users where username = user_ and pass is null;
	update users set pass = pass_ where username = user_ and pass is null;
	return id_user;
end;
$function$
;
