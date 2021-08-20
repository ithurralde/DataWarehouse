-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-08-2021 a las 17:13:07
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `datawarehouse`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canales`
--

CREATE TABLE `canales` (
  `id` int(11) NOT NULL,
  `canal` varchar(30) DEFAULT NULL,
  `cuenta_usuario` varchar(30) DEFAULT NULL,
  `preferencia` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `canales`
--

INSERT INTO `canales` (`id`, `canal`, `cuenta_usuario`, `preferencia`) VALUES
(98, 'Whatsapp', 'camila panto whatsapp', 'Canal favorito'),
(99, 'Facebook', 'agustin soria facebook', 'Canal favorito'),
(100, 'Whatsapp', 'agustin soria whatsapp', 'Canal favorito'),
(101, 'Instagram', 'denver soria instagram', 'Canal favorito'),
(102, 'Whatsapp', 'seba panto whatsapp', 'Sin preferencia'),
(103, 'Facebook', 'sofi soria facebook', 'Canal favorito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `id_pais` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id`, `nombre`, `id_pais`) VALUES
(5, 'Catalunia', 7),
(6, 'Barcelona', 7),
(7, 'Verona', 8),
(12, 'Tandil', 13),
(13, 'Olavarria', 13),
(16, 'Bogota', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companias`
--

CREATE TABLE `companias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `direccion` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `id_ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `companias`
--

INSERT INTO `companias` (`id`, `nombre`, `direccion`, `email`, `telefono`, `id_ciudad`) VALUES
(2, 'Netflix', 'direccion netflix', 'netflix@gmail.com', '+542262458795', 12),
(87, 'Ecom Experts', 'direccion Econ experts', 'ecom@gmail.com', '+542262484865', 12),
(88, 'Acámica', 'direccion acamica', 'acamica@gmail.com', '+542262458795', 6),
(89, 'Despegar', 'direccion despegar', 'despegar@gmail.com', '+542262458866', 13),
(90, 'Bootmaker', 'direccion bootmaker', 'bootmaker@gmail.com', '+542262457744', 16),
(91, 'Mercado Libre', 'direccion mercado libre', 'ml@gmail.com', '+542262454512', 7),
(92, 'Globant', 'direccion globant', 'globant@gmail.com', '+542262459865', 13),
(93, 'Telecom', 'direccion telecom', 'telecom@gmail.com', '+542262451548', 6),
(94, 'Naranja', 'direccion naranja', 'naranja@gmail.com', '+542262457832', 16),
(95, 'Ualá', 'direccion uala', 'uala@gmail.com', '+542262454531', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `cargo` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `compania` varchar(30) NOT NULL,
  `direccion` varchar(30) NOT NULL,
  `interes` float NOT NULL,
  `id_ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`id`, `nombre`, `apellido`, `cargo`, `email`, `compania`, `direccion`, `interes`, `id_ciudad`) VALUES
(121, 'Camila Soledad', 'Pantó', 'UX Designer', 'camilapanto123@gmail.com', 'Ecom Experts', 'direccion tandil', 1, 12),
(122, 'Agustín Emanuel', 'Soria', 'UI Designer', 'agustinsoria96@gmail.com', 'Acámica', 'direccion tandil', 1, 12),
(123, 'Denver Steven', 'Soria', 'Developer', 'denver-steven@gmail.com', 'Despegar', 'direccion olavarria', 1, 13),
(124, 'Sebastian Agustín', 'Pantó', 'Product', 'sebapanto@gmail.com', 'Bootmaker', 'direccion tandil', 0.75, 12),
(125, 'Stefanía Natalí', 'Soria', 'Sales', 'stefisoria@gmail.com', 'Netflix', 'direccion olavarria', 0.75, 13),
(126, 'Milena Victoria', 'Soria', 'UX Designer', 'milesoria@gmail.com', 'Mercado Libre', 'direccion tandil', 0.5, 12),
(127, 'Valentino', 'Boetto', 'UI Designer', 'valenboetto@gmail.com', 'Globant', 'direccion tandil', 0.5, 12),
(128, 'Juan', 'Sbeghen', 'Developer', 'juan-sbg@gmail.com', 'Telecom', 'direccion tandil', 0.25, 12),
(129, 'Guillermina', 'Budano', 'Product', 'guillebudano@gmail.com', 'Naranja', 'direccion tandil', 0.25, 12),
(130, 'Laura', 'Errante', 'Sales', 'laurapastelera@gmail.com', 'Ualá', 'direccion tandil', 0, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos_trabajan_en_companias`
--

CREATE TABLE `contactos_trabajan_en_companias` (
  `id_contacto` int(11) NOT NULL,
  `id_compania` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `contactos_trabajan_en_companias`
--

INSERT INTO `contactos_trabajan_en_companias` (`id_contacto`, `id_compania`) VALUES
(121, 87),
(122, 88),
(123, 89),
(124, 90),
(125, 2),
(126, 91),
(127, 92),
(128, 93),
(129, 94),
(130, 95);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paises`
--

CREATE TABLE `paises` (
  `id` int(11) NOT NULL,
  `region` varchar(30) NOT NULL,
  `nombre` varchar(35) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `paises`
--

INSERT INTO `paises` (`id`, `region`, `nombre`) VALUES
(2, 'America', NULL),
(4, 'Europa', NULL),
(7, 'Europa', 'España'),
(8, 'Europa', 'Italia'),
(9, 'Oceania', NULL),
(10, 'Oceania', 'Australia'),
(11, 'Europa', 'Francia'),
(12, 'America', 'Colombia'),
(13, 'America', 'Argentina'),
(14, 'America', 'Brasil');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tienen_canales`
--

CREATE TABLE `tienen_canales` (
  `id_canal` int(11) NOT NULL,
  `id_contacto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tienen_canales`
--

INSERT INTO `tienen_canales` (`id_canal`, `id_contacto`) VALUES
(98, 121),
(99, 122),
(100, 122),
(101, 123),
(102, 124),
(103, 125);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `perfil` varchar(30) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL,
  `contrasenia` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `nombre`, `apellido`, `email`, `perfil`, `admin`, `contrasenia`) VALUES
(24, 'Admin 2', 'admin', '2', 'admin2@gmail.com', 'admin', 1, 'admin'),
(25, 'Basico1', 'Basico', '1', 'basico1@gmail.com', 'Basico', 0, 'basico'),
(26, 'Basico2', 'Basico', '2', 'basico2@gmail.com', 'Basico', 0, 'basico'),
(27, 'Basico3', 'Basico', '3', 'basico3@gmail.com', 'Basico', 0, 'basico'),
(28, 'Basico4', 'Basico', '4', 'basico4@gmail.com', 'Basico', 0, 'basico'),
(29, 'admin', 'admin', '1', 'admin@gmail.com', 'Admin', 1, 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canales`
--
ALTER TABLE `canales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_pais_ciudades` (`id_pais`);

--
-- Indices de la tabla `companias`
--
ALTER TABLE `companias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_ciudad` (`id_ciudad`);

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_id_ciudad_contactos` (`id_ciudad`);

--
-- Indices de la tabla `contactos_trabajan_en_companias`
--
ALTER TABLE `contactos_trabajan_en_companias`
  ADD PRIMARY KEY (`id_contacto`,`id_compania`),
  ADD KEY `fk_id_compania` (`id_compania`);

--
-- Indices de la tabla `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tienen_canales`
--
ALTER TABLE `tienen_canales`
  ADD PRIMARY KEY (`id_canal`,`id_contacto`),
  ADD KEY `fk_id_contacto_canales` (`id_contacto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canales`
--
ALTER TABLE `canales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `companias`
--
ALTER TABLE `companias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT de la tabla `paises`
--
ALTER TABLE `paises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `fk_id_pais_ciudades` FOREIGN KEY (`id_pais`) REFERENCES `paises` (`id`);

--
-- Filtros para la tabla `companias`
--
ALTER TABLE `companias`
  ADD CONSTRAINT `fk_id_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id`);

--
-- Filtros para la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD CONSTRAINT `fk_id_ciudad_contactos` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id`);

--
-- Filtros para la tabla `contactos_trabajan_en_companias`
--
ALTER TABLE `contactos_trabajan_en_companias`
  ADD CONSTRAINT `fk_id_compania` FOREIGN KEY (`id_compania`) REFERENCES `companias` (`id`),
  ADD CONSTRAINT `fk_id_contacto` FOREIGN KEY (`id_contacto`) REFERENCES `contactos` (`id`);

--
-- Filtros para la tabla `tienen_canales`
--
ALTER TABLE `tienen_canales`
  ADD CONSTRAINT `fk_id_canal` FOREIGN KEY (`id_canal`) REFERENCES `canales` (`id`),
  ADD CONSTRAINT `fk_id_contacto_canales` FOREIGN KEY (`id_contacto`) REFERENCES `contactos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
