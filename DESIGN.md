## How the system works
The API is written with the help of the nest.js framework, and includes the following collection of modules:

1. The `hooks` module where most of the business logic happens, exposes one endpoint `/hooks`. It employs an `EventEmitter` to execute the database updates when it receives a request based on the name of the event:
- Make a POST request to the `/hooks` endpoint and specify the user ID in the query params:

`POST: /hooks?user={id}`

Request body examples:
```
Expample #1: 
  {
    "id": "USER_MATCHES_AD",
	"payload": { "adId": 2 }
  }
```
```
Expample #2: 
  {
    "id": "USER_READS_AD",
	"payload": { "adId": 2 },
	"period": 30
  }
```
- The controller gets the request and emits a corresponding event, and sends back a success code.
- The event listener processes the event by updating the DB.

2. The `ads` and `users` modules are used to get data from the database using `GET: /users`, `GET: /user/{id}`, and `GET: /ads`, so you can get a user or the list of all users, and for the `ads` module, we have two other endpoints that are each specified as follows:
- `GET: /ads/read?user={id}` this endpoint retrieves the ads that a user has read.
- `GET: /ads/matched?user={id}` this endpoint retrieves the ads that are matched with a user.

3. The `seeder` module is used to seed the database, and that's the only way to create the users and ads for the system:
-  An empty call to the `POST: /seed` endpoint creates 4 users and 2 ads that can be used to play with the API.

4. The `reports` module is the way we get reports on ads:
- `GET: /reports/ads/:id` shows the watch and read rate for an ad, indicating the percentage of users who watched and read the ad.
- `GET: /reports` shows the average read rate.

Controllers are mostly using database models directly, there's no service layer, because I didn't find a need for it now.
The database schema itself is fairly straightforward:

(The schema is created using `Sequelize`)
- User: {firstName, lastName, username, ads} 
- Ad: {targetingCriteria, users}
The above two tables are associated using a many-to-many relationship, the joining table User_Ad contains some more ad properties:
- User_Ad: {user, ad, isRead, period}

To view the database schema, please navigate to `db-schema.png`.

#### Why was this design chosen?
Software is supposed to be soft, or easy to change, that is the reason why the `modular` design was chosen. Nest.js supports dependency injection, so any module can be easily changed and replaced by another implementation.

#### What assumptions were made from possibly unclear requirements?
I assumed that an Ad cannot be read if it wasn't matched before.

#### What are the limitations of this design? What are the likely bottlenecks and how could they be mitigated?
The events we listen to can be lost and they cannot be retried - this can be solved by using a better queue service.

#### Any alternative approaches that could be considered?
I think there's just an infinity of approaches that could be used to solve this problem.

It can be serverless, it can use Segment for events, it can use a queue, it can be microservices-based, or any other way. It can start in any way and evolve in any other way. It really depends on how users are interacting with it.

### Authentication
Authentication was replaced by a query parameter `?user={id}`, in a production environment an authentication system would be a must. Auth0 or firebase are good tools to start with.

### Testing
The E2E tests I wrote were kind of a user story from the perspective of mobile apps, I suggest you to check out `test/app.e2e-spec.ts`. I didn't write the unit tests just because the system was quite simple.

### Deployment
We do have a Dockerfile for the APP, but we would need to have some of our configs in a `.env` file in order to make deployment possible, right now the only thing the API needs to connect with is the DB, so I would have the database config dependent on the environment. Some kind of control flow statement that gives the APP the right config, based on where it's deployed.

### API and database versioning, upgrades, and migrations
API versioning is important when it's used by a mobile APP. Mandatory updating of the APP to the last version does not always work, at least whenever we have a new version of the API that would break the last mobile app version, we should have a period of migration where the last version of the API is live too.

On the other hand, database versioning allows us to share the database between development, staging, and production environments. It reduces downtime brought on by database modifications. It also allows us to roll back bad changes quickly. Normally I create/update models, generate migrations, and commit all of these changes at once. Why? Because this way I can ensure that everyone on the team applies migrations the same way and on staging and production environments too.

### Abuse
Secure authentication will play a great role in preventing abuse, also we should monitor API calls that seem to be from Bots.

### Server health metrics
Monitoring. Watch out for crashes, if we're using Kubernetes we should have some kind of always restart policy to keep the API alive as much as possible, we should also track down crashes and see what's causing them and then fix them.

### Anything else that would be required to get this production-ready?
In my experience logging plays a huge role in fixing production problems. I would want to implement a great logging system, maybe add some IDs to requests that can appear in all logs after a user makes a request to the backend.

I'm personally not tied to a set of things that any app must have to be production ready, we know that these things can change quickly and they depend on teams, systems and users.