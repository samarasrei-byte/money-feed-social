DO $$ 
DECLARE 
    func RECORD;
BEGIN
    -- For all SECURITY DEFINER functions in public schema
    FOR func IN (
        SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.prosecdef = true
    ) LOOP
        -- Revoke from PUBLIC
        EXECUTE 'REVOKE EXECUTE ON FUNCTION ' || quote_ident(func.nspname) || '.' || quote_ident(func.proname) || '(' || func.args || ') FROM PUBLIC';
        -- Grant to authenticated and service_role
        EXECUTE 'GRANT EXECUTE ON FUNCTION ' || quote_ident(func.nspname) || '.' || quote_ident(func.proname) || '(' || func.args || ') TO authenticated, service_role';
    END LOOP;
END $$;
