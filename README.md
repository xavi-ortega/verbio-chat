# VerbioChat

A test to apply to Verbio Technologies for Front-end development.

## Set up

- Node 12.16.2
- npm 6.14.4

## Installation

```bash
npm install
```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Production

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Configuration

You can configure this project by change the environment variables at `src/environment` files (there is development and production environment).

## Implementation

### Routing

It has the `src/app/app-routing.module.ts` to asing a Component to a particular route and set the guards.

See more about [Routing](https://angular.io/guide/router)

### Components

It has the `LoginComponent` and the `ChatComponent`. They are used as pages and the router asigns them to a particular route. It also has the `NotFoundComponent` to handle an unknown route. Components are responsible for rendering the UI.

See more about [Components](https://angular.io/guide/architecture-components)

### Services

It has the `AuthService` to handle the token storage and login request and the `ChatService` to handle the requests related to the Chatbot. They are the layer between components and HTTP requests.

See more about [Services](https://angular.io/tutorial/toh-pt4)

### Guards

It has the `AuthGuard` to check if the session is correct before navigating to Chat and the `GuestGuard` to check if there's no session before navigating to login page.

See more about [CanActivate Guards](https://angular.io/api/router/CanActivate)

### Http Interceptor

It has the `NoAuthHttpInteceptor` to check if any request returns error 401 and it's responsible for handling the redirection to login page if it happens.

See more about [HttpInterceptors](https://angular.io/api/common/http/HttpInterceptor)

## Testing

It has `*.spec.ts` files to write the tests source code. They are placed on the same folder of the file that is being tested.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
