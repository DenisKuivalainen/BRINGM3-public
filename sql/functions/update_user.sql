CREATE OR REPLACE FUNCTION public.update_user(session_ text, id_ integer, can_add_ boolean, can_reserve_ boolean, can_delete_ boolean)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
	user_id_ integer;
begin
	select user_id into user_id_ from sessions where id = session_;

	if not((select count(*) from sessions where id = session_) = 1) and not(select is_head from users where id = user_id_) and not((select family_id from users where id = id_) = (select family_id from users where id = user_id_)) then return false;
	end if;

	update users set can_add = can_add_, can_reserve = can_reserve_, can_delete = can_delete_ where id = id_;
	
	return true;
end;
$function$
;
