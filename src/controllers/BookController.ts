const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


export const BookController = {
    create: async ({ body }: {
        body: {
            name: string,
            price: number
        }
    }) => {
        await prisma.book.create({ data: body })
        return { message: 'success' }
    },
    list: async () => {
        return await prisma.book.findMany()
    },
    update: async ({ params, body }: {
        params: {
            id: string
        }
        body: {
            name: string
            price: number
        }
    }) => {
        await prisma.book.update({
            where:{id: params.id },
            data:body
        })
        return { message: "success" }
    },
    remove: async ({params }:{
        params:{id:string}
    }) => { 
        await prisma.book.delete({
            where:{
                id:params.id
            }
        })
        return { message: "success" }
    }
}