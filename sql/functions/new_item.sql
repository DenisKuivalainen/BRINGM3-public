CREATE OR REPLACE FUNCTION public.new_item(session_ text, title_ text, desc_ text, category_ integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
	user_id_ integer;
	family_id_ integer;
	can_add_ boolean;
	session_exists integer;
	
begin
	select user_id into user_id_ from sessions where id = session_;

	select count(*) into session_exists from sessions where id = session_;
	if session_exists = 0 then return false;
	end if;

	select can_add into can_add_ from users where id = user_id_;
	if not(can_add_) then return false;
	end if;

	select family_id into family_id_ from users where id = user_id_;

	insert into items values ((select max(id) from items) + 1, title_, desc_, category_, family_id_, user_id_, null);
	
	return true;
end;
$function$
;