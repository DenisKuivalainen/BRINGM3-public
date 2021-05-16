CREATE OR REPLACE FUNCTION public.delete_item(session_ text, id_ integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
	user_id_ integer;
	can_delete_ boolean;
	session_exists integer;
begin
	select user_id into user_id_ from sessions where id = session_;

	select count(*) into session_exists from sessions where id = session_;
	if session_exists = 0 then return false;
	end if;

	select can_delete into can_delete_ from users where id = user_id_;
	if not(can_delete_) then return false;
	end if;

	delete from items where id = id_;
	
	return true;
end;
$function$
;
