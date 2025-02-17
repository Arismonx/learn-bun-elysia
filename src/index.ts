import { Elysia } from "elysia";

const app = new Elysia()
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

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
