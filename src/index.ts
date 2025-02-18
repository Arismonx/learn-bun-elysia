import { Elysia, error } from "elysia";
import { jwt } from '@elysiajs/jwt'
import { staticPlugin } from '@elysiajs/static'
import fs from 'fs/promises';

const app = new Elysia()
  .use(staticPlugin({
    assets: './uploads',
    prefix: '/uploads',
  }))
  .use(
    jwt({
      name: 'jwt',
      secret: 'mamafafa'
    })
  )
  .get("/", () => "Hello Elysia Framwork")
  .get('/hello', () => {
    return { message: 'hello world' }
  })
  .get('/hello/:name', ({ params: { name } }) => {
    return { message: `Hello ${name}` }
  })
  .get('/hello/:name/:age', ({ params }: {
    params: {
      name: string
      age: number
    }
  }) => {
    const name = params.name
    const age = params.age
    return { message: `Hello ${name}, you are ${age} year old.` }
  })

  .get('/customers/:id', ({ params }: {
    params: {
      id: number
    }
  }) => {
    const customers = [
      { id: 1, name: 'Tuschy', age: 20 },
      { id: 2, name: 'Arismonx', age: 21 },
      { id: 3, name: 'Nrinee', age: 22 },
    ]
    const customer = customers.find((customer) => customer.id == Number(params.id));
    if (!customer) return { error: 'Customer ont found' }
    return customer
  })
  //http://localhost:3000/customers/query?name=tus&age=60
  .get('/customers/query', ({ query }) => {
    const name = query.name
    const age = query.age
    return { message: `Hello ${name}, you are ${age} year old.` }
  })
  .post('/customers/create', ({ body }: {
    body: {
      name: string
      age: number
    }
  }) => {
    const name = body.name
    const age = body.age
    return { message: `Hello ${name}, you are ${age} year old.` }
  })

  .put('/customers/update/:id', ({ params, body }: {
    params: {
      id: number
    },
    body: {
      name: string
      age: number
    }
  }) => {
    const id = params.id
    const name = body.name
    const age = body.age
    return { message: `Hello ${id} : ${name}, you are ${age} year old.` }
  })
  .delete('/customers/remove/:id', ({ params }: {
    params: {
      id: number
    }
  }) => {
    return { message: `Delete customer ${params.id}` }
  })

  .post('/user/signin', async ({ jwt, set, body }: {
    jwt: any,
    set: any,
    body: {
      username: string
      password: string
    }
  }) => {
    try {
      const { username, password } = body;
      if (username !== "admin" || password !== "1234") {
        set.status = 401;
        return { error: "Invalid username or password" }
      }
      const token = await jwt.sign({ username }, {
        expiresIn: '1d'
      })
      return { token }
    } catch {
      set.status = 500
      return { error: error }
    }
  })

  .get('/user/profile', async ({ jwt, cookie: { auth } }: {
    jwt: any,
    cookie: any
  }) => {
    const { username } = await jwt.verify(auth.value);
    return { message: `Hello ${username}` }
  })

  .get('/user/profileFromToken', async ({ jwt, request }: {
    jwt: any,
    request: any
  }) => {
    const authorzation = request.headers.get('Authorzation');
    const token = authorzation?.split(' ')[1];
    const { username } = await jwt.verify(token);
    return { message: `Hello ${username}` }
  })

  .post('/upload-file', ({ body }: { body: { file: File } }) => {
    const file = body.file;
    Bun.write('uploads/' + file.name, file);
    return { message: "File uploaded" }
  })

  .get('/write-file', () => {
    Bun.write('uploads/test.txt', 'Hello world');
    return { message: "File written" }
  })

  .get('/read-file', async () => {
    const path = "./uploads/test.txt";
    const content = Bun.file(path);
    const text = await content.text();
    return { message: text }
  })

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
