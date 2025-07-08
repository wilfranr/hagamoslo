# TaskManagerApp

Aplicación en React Native (Expo) para gestionar tareas cotidianas de forma sencilla.
## Estructura
- `TaskManagerApp/` contiene la aplicación React Native.
  - `App.js`: pantalla principal con listado de tareas.
  - `src/components/`: componentes reutilizables para la gestión de tareas.
## Requisitos previos
- Node.js 18 o superior (usa `node --version` para verificar)
- Expo CLI:
  ```bash
  npm install -g expo-cli
  ```


## Uso
1. Instalar dependencias:
   ```bash
   cd TaskManagerApp
   npm install
   ```
2. Iniciar la aplicación en Android:
   ```bash
   npm run android
   ```

3. Ejecutar pruebas unitarias:
   ```bash
   npm test
   ```

> Necesitarás conexión a internet para que Expo descargue sus dependencias.

Se puede usar Expo Go o un emulador para ver la app.

## Características implementadas

- Persistencia de tareas utilizando **AsyncStorage**.
- Formulario para crear tareas con subtareas (checklist) y fecha límite.
- Recordatorios opcionales mediante **notificaciones locales** de Expo.
- Estilo neumórfico con animaciones de `react-native-reanimated`.
- Retroalimentación háptica al completar o eliminar tareas.
- Eliminación con posibilidad de **deshacer** mediante `Snackbar`.
- Pruebas unitarias con **Jest** y `@testing-library/react-native`.
