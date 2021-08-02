CREATE TABLE usuarios(
	id INT NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
	email VARCHAR(30)NOT NULL UNIQUE,
    perfil VARCHAR(30),
    admin BOOLEAN NOT NULL,
    contrasenia VARCHAR(30) NOT NULL,
    CONSTRAINT pk_id_usuarios PRIMARY KEY (id)
);

CREATE TABLE paises(
	id INT NOT NULL AUTO_INCREMENT,
    region VARCHAR(35) NOT NULL,
    nombre VARCHAR(35),
    CONSTRAINT pk_id_paises PRIMARY KEY (id)
);

CREATE TABLE ciudades(
	id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    id_pais INT NOT NULL,
    CONSTRAINT pk_id_ciudades PRIMARY KEY (id),
    CONSTRAINT fk_id_pais_ciudades FOREIGN KEY (id_pais) REFERENCES paises(id)
);

CREATE TABLE contactos(
	id INT NOT NULL AUTO_INCREMENT,
    nombre INT NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    cargo VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    compania VARCHAR(30) NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    interes INT NOT NULL,
    canal_contacto VARCHAR(30) NOT NULL,
    preferencias VARCHAR(30) NOT NULL,
    id_ciudad INT NOT NULL,
    CONSTRAINT pk_contactos PRIMARY KEY (id),
    CONSTRAINT fk_id_ciudad_contactos FOREIGN KEY (id_ciudad) REFERENCES ciudades(id)
);

CREATE TABLE companias(
	id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    id_ciudad INT NOT NULL,
    CONSTRAINT pk_id_companias PRIMARY KEY (id),
    CONSTRAINT fk_id_ciudad FOREIGN KEY (id_ciudad) REFERENCES ciudades(id)
);

CREATE TABLE contactos_trabajan_en_companias(
	id_contacto INT NOT NULL,
    id_compania INT NOT NULL,
    CONSTRAINT pk_id_contactos_trabajan_en_companias PRIMARY KEY (id_contacto, id_compania),
    CONSTRAINT fk_id_contacto FOREIGN KEY (id_contacto) REFERENCES contactos(id),
    CONSTRAINT fk_id_compania FOREIGN KEY (id_compania) REFERENCES companias(id)
);