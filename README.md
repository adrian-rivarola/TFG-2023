# Trabajo final de grado - UNAE 2023
> Tema: Desarrollo de una aplicación móvil multiplataforma para el control de gastos personales.

## Tabla de Contenidos
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Ejecutar la aplicación](#ejecutar-la-aplicación)
- [Otros comandos](#otros-comandos)
- [Licencia](#licencia)

## Requisitos
Este proyecto require tener instalado [Node](http://nodejs.org/) y [Yarn](https://yarnpkg.com/getting-started/install).

## Instalación
Clonar el repositorio:
```sh
$ git clone https://github.com/adrian2358/TFG-2023
$ cd TFG-2023
```

Instalar dependencias:
```sh
$ yarn
```

## Ejecutar la aplicación
Iniciar la app en modo de desarrollo:
```sh
$ yarn start
```
Este comando abre la consola de Metro con un código QR que puede ser escaneado desde un dispositivo móvil conectado a la misma red, utilizando la aplicación [Expo Go](https://expo.dev/client).

También es posible iniciar la aplicación en una plataforma específica, utilizando un emulador o un dispositivo conectado:
```sh
$ yarn android
```
```sh
$ yarn ios
```

## Otros comandos
Ejecutar pruebas unitarias:
```sh
$ yarn test
```

Ejecutar linter:
```sh
$ yarn eslint .
```

Ejecutar formateador de código:
```sh
$ yarn prettier --check .
```

## Licencia
Distribuido bajo la licencia MIT. Ver [LICENSE](LICENSE) para más información.
