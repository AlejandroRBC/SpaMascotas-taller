-- Script para corregir los valores null en la base de datos de SpaMascotas
-- y asegurar que los roles necesarios existen.

-- 1. Actualizar los campos que eran primitivos a sus valores por defecto si están nulos
UPDATE usuarios SET intentos_fallidos = 0 WHERE intentos_fallidos IS NULL;
UPDATE usuarios SET dos_factor_habilitado = false WHERE dos_factor_habilitado IS NULL;
UPDATE usuarios SET requiere_cambio_contrasenia = false WHERE requiere_cambio_contrasenia IS NULL;
UPDATE usuarios SET email_verificado = false WHERE email_verificado IS NULL;

-- 2. Asegurar que existen los roles (ADMIN, RECEPCIONISTA, GROOMER, CLIENTE)
INSERT INTO roles (id, nombre) 
SELECT nextval('roles_id_seq'), 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'ADMIN');

INSERT INTO roles (id, nombre) 
SELECT nextval('roles_id_seq'), 'RECEPCIONISTA'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'RECEPCIONISTA');

INSERT INTO roles (id, nombre) 
SELECT nextval('roles_id_seq'), 'GROOMER'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'GROOMER');

INSERT INTO roles (id, nombre) 
SELECT nextval('roles_id_seq'), 'CLIENTE'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'CLIENTE');

-- 3. Si hay algún usuario bloqueado que deba ser desbloqueado para probar, descomenta:
-- UPDATE usuarios SET bloqueado_hasta = NULL, intentos_fallidos = 0;
