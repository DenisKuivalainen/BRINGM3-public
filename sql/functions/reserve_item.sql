CREATE OR REPLACE FUNCTION public.reserve_item(session_ text, id_ integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
	user_id_ integer;
	can_reserve_ boolean;
	session_exists integer;
	reserved_id_ integer;
begin
	select user_id into user_id_ from sessions where id = session_;

	select count(*) into session_exists from sessions where id = session_;
	if session_exists = 0 then return false;
	end if;

	if not((select items.family_id from items where id = id_) = (select users.family_id from users where id = user_id_)) then return false;
	end if;

	select can_reserve into can_reserve_ from users where id = user_id_;
	if not(can_reserve_) then return false;
	end if;

	select reserved_id into reserved_id_ from items where id = id_;

	if reserved_id_ is null then reserved_id_ := user_id_;
	else reserved_id_ := null;
	end if;

	update items set reserved_id = reserved_id_ where id = id_;
	
	return true;
end;
$function$
;
